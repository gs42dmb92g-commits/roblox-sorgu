export default async function handler(req, res) {
    const username = req.query.user;

    if (!username) {
        return res.json({ error: "Kullanıcı adı gir" });
    }

    try {
        const userReq = await fetch(
            "https://users.roblox.com/v1/usernames/users",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usernames: [username]
                })
            }
        );

        const userData = await userReq.json();

        if (!userData.data.length) {
            return res.json({
                error: "Kullanıcı bulunamadı"
            });
        }

        const userId = userData.data[0].id;

        const groupReq = await fetch(
            `https://groups.roblox.com/v2/users/${userId}/groups/roles`
        );

        const groupData = await groupReq.json();

        const groups = groupData.data.map(g => g.group.name);

        return res.json({
            user: username,
            groups: groups
        });
    } catch {
        return res.json({
            error: "Hata oluştu"
        });
    }
}