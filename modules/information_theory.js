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
        .setName('efficiency')
        .setDescription('能率の計算'),
    async execute(interaction){
        const modal = new ModalBuilder()
        .setCustomId('efficiency')  
        .setTitle('能率e(半角で入力してください)');
    
        const probabilities = new TextInputBuilder()
            .setCustomId('probabilities')
            .setLabel("各確率(,区切り)")
            .setStyle(TextInputStyle.Short);
    
        const codes_length = new TextInputBuilder()
            .setCustomId('codes-length')
            .setLabel("各事象に割り当てられた符号の長さ(,区切り)")
            .setStyle(TextInputStyle.Short);    
                
        modal.addComponents(
            new ActionRowBuilder().addComponents(probabilities),
            new ActionRowBuilder().addComponents(codes_length),
        );
        
        await interaction.showModal(modal);
        const filter = (mInteraction) => mInteraction.customId === 'efficiency';
        interaction.awaitModalSubmit({ filter, time: 600000 })
            .then(async mInteraction => {
                const form_probabilities = mInteraction.fields.getTextInputValue('probabilities');
                const form_codes_length = mInteraction.fields.getTextInputValue('codes-length');
        
                let probabilities = form_probabilities.split(/,/);
                let codes_length = form_codes_length.split(/,/);
        
                let L = 0;
                let entropy = 0; 

                if(probabilities.length != codes_length.length){
                    return mInteraction.reply({ content: 'フォームに入力された値に不備があります。', ephemeral: true });
                }

                elements_length = probabilities.length;

                for(i = 0;i < elements_length;i++){
                    try{
                        if(probabilities[i].match(/[0-9]{0,}\/[0-9]{0,}/)){
                            probabilities[i] = probabilities[i].split(/\//)[0] / probabilities[i].split(/\//)[1]
                        }
                    }catch(error){}
                    entropy += probabilities[i] * Math.log2(probabilities[i])
                    L += codes_length[i] * probabilities[i]
                }
                entropy *= -1
        
                if(entropy == 0 || L == 0 || entropy / L == 0 || entropy == NaN || L == NaN || entropy / L == NaN){
                    return mInteraction.reply({ content: 'フォームに入力された値に不備があります。', ephemeral: true });
                }else{
                    return mInteraction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`エントロピー：${entropy}\n平均符号長：${L}\n能率e：${entropy/L}`)
                                .setColor(7506394)
                        ]
                    })
                }
            })
            .catch(console.error);
    }
}

// 全角から半角へ変換する関数
// 要素数が不要なので多分不要
// function hankaku2Zenkaku(str) {
//     return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
//         return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
//     });
// }