const Router = (server) => {
    server.get("/", (req, res) => {
        try {
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
        }
    });
};

export default Router;
