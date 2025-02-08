import express from "express"
import cors from "cors"   // npm i cors
import env from "dotenv"  //npm i dotenv
import mongoose from "mongoose"    // nmp i mongosse
import { authMiddleware } from "./middleware/authmiddleware.js"
import routerPreceptor from "./router/routerPreceptor.js"
import routerProfesor from "./router/routerProfesor.js"
import routerAlumno from "./router/routerAlumno.js"
import routerMateria from "./router/routerMateria.js"

env.config()
const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(cors(
    {
        origin: "*",
        allowedHeaders: ["content-Type", "Authorization","x-refresh-token"],
    }
))


app.use("/preceptor",routerPreceptor)
app.use("/profesor", routerProfesor)
app.use("/alumnos", routerAlumno)
app.use("/materias", routerMateria)

app.use("/protected",authMiddleware, (req, res) => {
    res.json({ message: "Acceso permitido", user: req.user })
})


app.use((req,res) => {
    res.status(404).send.apply("<h1>404</h1>")
})

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Connected to MongoDB")
})
.catch((error) => {
    console.error("Error connection to MongoDB:", error)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})