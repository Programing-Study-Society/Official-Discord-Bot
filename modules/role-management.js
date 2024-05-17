function getRandomColor() {
    // 0から16777215 (0xFFFFFF) の間のランダムな数を生成し、16進数に変換
    return Math.floor(Math.random() * 16777215).toString(16);
}

exports.roleAdd = async function(interaction,members, rolename)
{
    let role = null;
    // ロールが作成済みか確認
    if (!interaction.guild.roles.cache.find(role => role.name === rolename)) {
        // インタラクションされたサーバーにロールを作成
        role = await interaction.guild.roles.create({
            name: rolename,
            color: getRandomColor(),
            // permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
        });
    } else {
        role = interaction.guild.roles.cache.find(role => role.name === rolename)
        console.log(`${rolename}は既に存在しています`);
    }
    
    // ロールが見つかったら付与
    if (role) {
        try {
            for(let i = 0; i < members.length; i++)
            {
                const member = await interaction.guild.members.fetch(members[i].id)
                await member.roles.add(role);
            }
        } catch (error) {
            console.error('ロールの付与に失敗しました', error);
        }
    }

}

exports.roleDelete = async function(interaction)
{
    let role;
    if(role = interaction.guild.roles.cache.find(role => role.name === "チーム余り"))
    {
        await role.delete()
    }
    for(let i = 0; i < 26; i++)
    {
        let teamName = "チーム" + String.fromCharCode(65 + i);
        if(role = interaction.guild.roles.cache.find(role => role.name === teamName))
        {
            await role.delete()
        }
        else
        {
            break;
        }
    }
}