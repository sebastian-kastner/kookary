import { Configuration } from './api/configuration'
import { Ingredients, IngredientsApi } from './api/api'

export const restConfig = new Configuration({
  basePath: 'http://localhost:8000'
})

async function getIngredients (): Promise<Ingredients[]> {
  // const client = new IngredientsApi(new Configuration(), 'http://localhost:8000')
  const client = new IngredientsApi(restConfig)
  const foo = await client.getIngredientsCollection()
  console.log(foo.data['hydra:member'])

  return []
}
