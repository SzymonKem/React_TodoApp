import Team from "../models/Team.js";

export let teams = {};
export let users = new Map();

export function Socket(ws, req) {
    console.log("connected");
    ws.isAlive = true;
    ws.on("pong", () => {
        ws.isAlive = true;
    });
    const user = JSON.parse(req.query.currentUser);
    const owner = JSON.parse(req.query.listOwner);
    if (owner.type == "team") {
        const teamId = owner.id;
        if (!teams[teamId]) {
            teams[teamId] = new Set();
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
    if (msg == "tasksUpdated" || msg == "tagsUpdated") {
        if (teams[teamId]) {
            teams[teamId].forEach((ws) => {
                if (ws.readyState === 1) {
                    ws.send(msg);
                }
            });
        }
    }
    if (msg == "teamsUpdated") {
        users.keys().forEach((user) => {
            if (teamsUsers.includes(user)) {
                if (users.get(user).readyState === 1) {
                    users.get(user).send(msg);
                }
            }
        });
    }
}
