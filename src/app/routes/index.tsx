import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { routes } from "./routes"
import HomeScreen from "../ui/screens/Home"

export default function SGARoutes() {
	const router = createBrowserRouter(
		[
			{
				path: routes.home.route,
				element: <HomeScreen />,
				errorElement: null,
			},
		]
	)

	return (
		<RouterProvider router={router} />
	)
}