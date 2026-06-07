import { defineServer, monitor, playground, createRouter, createEndpoint, } from "colyseus";
import { gameRooms } from "./games/index.js";
const server = defineServer({
    rooms: gameRooms,
    routes: createRouter({
        api_hello: createEndpoint("/api/hello", { method: "GET" }, async () => {
            return { message: "Hello from fast-game Colyseus" };
        }),
    }),
    express: (app) => {
        app.get("/hi", (_req, res) => {
            res.send("fast-game Colyseus server");
        });
        app.use("/monitor", monitor());
        if (process.env.NODE_ENV !== "production") {
            app.use("/playground", playground());
        }
    },
});
export default server;
