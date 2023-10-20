const { 
    ActionRowBuilder,
    SlashCommandBuilder,
    TextInputStyle,
    ModalBuilder,
    TextInputBuilder,
    EmbedBuilder,
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nouritu')
        .setDescription('能率の計算'),
    async execute(interaction){
        const modal = new ModalBuilder()
        .setCustomId('nouritu')  
        .setTitle('能率e(半角で入力してください)');
        
        const r = new TextInputBuilder()
            .setCustomId('r')
            .setLabel("要素数")
            .setStyle(TextInputStyle.Short);
    
        const n = new TextInputBuilder()
            .setCustomId('p')
            .setLabel("各確率(,区切り)")
            .setStyle(TextInputStyle.Short);
    
        const f = new TextInputBuilder()
            .setCustomId('f_num')
            .setLabel("各事象に割り当てられた符号の長さ(,区切り)")
            .setStyle(TextInputStyle.Short);    
                
        modal.addComponents(
            new ActionRowBuilder().addComponents(r),    
            new ActionRowBuilder().addComponents(n),
            new ActionRowBuilder().addComponents(f),
        );
        
        await interaction.showModal(modal);
        const filter = (mInteraction) => mInteraction.customId === 'nouritu';
        interaction.awaitModalSubmit({ filter, time: 600000 })
            .then(async mInteraction => {
                const r = hankaku2Zenkaku(mInteraction.fields.getTextInputValue('r'));
                const n = mInteraction.fields.getTextInputValue('p');
                const f = mInteraction.fields.getTextInputValue('f_num');
        
                let n_arry = n.split(/,/);
                let f_arry = f.split(/,/);
        
                let L = 0;
                let en = 0; 

                console.log(f_arry.length,n_arry.length)
                if(r != f_arry.length || r != n_arry.length){
                    return mInteraction.reply({ content: 'フォームに入力された値に不備があります。', ephemeral: true });
                }

                for(i = 0;i < r;i++){
                    try{
                        if(n_arry[i].match(/[0-9]{0,}\/[0-9]{0,}/)){
                            n_arry[i] = n_arry[i].split(/\//)[0] / n_arry[i].split(/\//)[1]
                        }
                    }catch(error){}
                    en += n_arry[i] * Math.log2(n_arry[i])
                    L += f_arry[i] * n_arry[i]
                }
                en *= -1
        
                console.log(`エントロピー：${en}`)
                console.log(`平均符号長：${L}`)
                console.log(`能率e：${en/L}`)
        
                if(en == 0 || L == 0 || en/L == 0 || en == NaN || L == NaN || en/L == NaN){
                    return mInteraction.reply({ content: 'フォームに入力された値に不備があります。', ephemeral: true });
                }else{
                    return mInteraction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`エントロピー：${en}\n平均符号長：${L}\n能率e：${en/L}`)
                                .setColor(7506394)
                        ]
                    })
                }
            })
            .catch(console.error);
    }
}

function hankaku2Zenkaku(str) {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}