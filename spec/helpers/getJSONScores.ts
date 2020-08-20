import { resolve, sep } from 'path'
import { readdirSync } from 'fs'
import { readpixels } from './readpixels'

export type LoadedData = {
  file: ImageData
  mssim: number
  reference: ImageData
}

function filterFiles(file = '', extension: string) {
  return file.toLowerCase().endsWith(extension)
}

async function fileToObjectPath(
  scores: { [key: string]: number },
  path: string,
  fileName: string,
  extension: string
): Promise<{ [key: string]: LoadedData }> {
  let referenceFile = (fileName.split(sep).pop() || '').split('_')[0] || ''

  if (!referenceFile.endsWith(`.${extension}`)) {
    referenceFile += `.${extension}`
  }

  if (scores[fileName] === 0) {
    return {}
  }

  const reference = resolve(path, referenceFile)
  const file = resolve(path, fileName)

  return {
    [fileName]: {
      reference: await readpixels(reference),
      file: await readpixels(file),
      mssim: scores[fileName] || 0,
    },
  }
}

export async function getJSONScores(
  scores: { [key: string]: number },
  path: string,
  extension: string
) {
  const objects = await Promise.all(
    readdirSync(path)
      .filter((file) => filterFiles(file, extension))
      .map((fileName) => fileToObjectPath(scores, path, fileName, extension))
  )

  return objects.reduce(
    (acc, curr) => ({ ...acc, ...curr }),
    {} as { [key: string]: LoadedData }
  )
}
