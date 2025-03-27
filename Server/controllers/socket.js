import Team from "../models/Team.js";

export let teams = {};
export let users = new Map();

export function Socket(ws, req) {
    console.log("connected");
    ws.isAlive = true;
    ws.on("pong", () => {
        ws.isAlive = true;
    });
    console.log(req.query.listOwner);
    const user = JSON.parse(req.query.currentUser);
    const owner = JSON.parse(req.query.listOwner);
    console.log(owner);
    if (owner.type == "team") {
        const teamId = owner.id;
        if (!teams[teamId]) {
            teams[teamId] = new Set();
            // console.log(teams[teamId]);
        }

        teams[teamId].add(ws);
        console.log(`Client connected to team: ${teamId}`);
        ws.on("close", () => {
            teams[teamId].delete(ws);
            console.log(`Client disconnected from team: ${teamId}`);
            if (teams[teamId].size == 0) {
                delete teams[teamId];
            }
        });
    }
    users.set(user.id, ws);
}

export async function broadcastToClients(teamId, msg, teamsUsers) {
    // console.log(teams);
    if (msg == "tasksUpdated") {
        if (teams[teamId]) {
            teams[teamId].forEach((ws) => {
                console.log("sent");
                if (ws.readyState === 1) {
                    ws.send(msg);
                }
            });
        }
    }
    if (msg == "teamsUpdated") {
        // console.log(users);
        console.log(teamsUsers);
        console.log(users);
        users.keys().forEach((user) => {
            console.log(user);
            if (teamsUsers.includes(user)) {
                console.log("team includes user");
                console.log(users.get(user).readyState);
                if (users.get(user).readyState === 1) {
                    console.log("users socket is ready");
                    users.get(user).send(msg);
                    console.log("Message sent to user: " + msg);
                }
            }
        });
    }
}
