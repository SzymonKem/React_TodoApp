const Router = (server) => {
    server.get("/", (req, res) => {
        try {
            res.sendFile("../build/TodoApp/index.html");
        } catch (err) {
            res.sendStatus(500);
        }
    });
};

export default Router;
