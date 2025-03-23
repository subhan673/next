import { User } from "@/app/_action/user"
import Table  from "./table"
export default async function UserList() {
    const users = await User()
    return (
      <Table data={JSON.parse(JSON.stringify(users))} />
    )
}