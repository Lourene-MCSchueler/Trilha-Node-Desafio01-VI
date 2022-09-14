import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient"

export const handler: APIGatewayProxyHandler = async (event) => {

  const { id } = event.pathParameters

  const response = await document
    .scan({
      TableName: 'todos',
      FilterExpression: ':user_id = user_id',
      ExpressionAttributeValues: {
        ':user_id': id,
      },
    })
    .promise();

  const userToDo = response.Items

  if (userToDo) {
    return {
      statusCode: 200,
      body: JSON.stringify(userToDo),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Não existem tarefas para este usuário!",
    })
  }
}