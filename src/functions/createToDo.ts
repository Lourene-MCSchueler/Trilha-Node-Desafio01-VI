import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from "../utils/dynamodbClient"
import { v4 as uuidV4 } from "uuid"
import dayjs from "dayjs";

interface ICreateToDo {
  title: string;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {

  const { id } = event.pathParameters
  const { title, deadline } = JSON.parse(event.body) as ICreateToDo

  await document.put({
    TableName: "todos",
    Item: {
      id: uuidV4(),
      user_id: id,
      title,
      done: false,
      deadline: dayjs(deadline).format("DD/MM/YYYY")
    }
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: `Tarefa "${title}" criada com sucesso!`,
    }),
    headers: {
      "Content-type": "application/json",
    },
  }
}