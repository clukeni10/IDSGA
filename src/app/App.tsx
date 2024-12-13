import { useEffect } from "react";
import SGARoutes from "./routes";
import { createDatabase } from "./database/IndexedDB/IndexedDBStore";


export default function App(): JSX.Element {

	useEffect(() => {
		createDatabase(1)
	}, [])

	return <SGARoutes />
}