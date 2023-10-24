const { 
    ActionRowBuilder,
    SlashCommandBuilder,
    TextInputStyle,
    ModalBuilder,
    TextInputBuilder,
    EmbedBuilder,
} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('efficiency')
        .setDescription('能率の計算'),
    execute: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId('efficiency')  
            .setTitle('能率e(半角で入力してください)');
    
        const probabilitiesForm = new TextInputBuilder()
            .setCustomId('probabilities')
            .setLabel("各事象の確率 ( 半角数字 ,区切り )")
            .setStyle(TextInputStyle.Short);
    
        const codesLengthForm = new TextInputBuilder()
            .setCustomId('codes-length')
            .setLabel("各事象の符号長 ( 半角数字 ,区切り )")
            .setStyle(TextInputStyle.Short);    
                
        modal.addComponents(
            new ActionRowBuilder().addComponents(probabilitiesForm),
            new ActionRowBuilder().addComponents(codesLengthForm),
        );
        
        await interaction.showModal(modal);
        const filter = (mInteraction) => mInteraction.customId === 'efficiency';
        interaction.awaitModalSubmit({ filter, time: 600000 })
            .then(async (mInteraction) => {
                const inputProbabilities = mInteraction.fields.getTextInputValue('probabilities');
                const inputCodesLength = mInteraction.fields.getTextInputValue('codes-length');
        
                let probabilities = inputProbabilities.split(/\s{0},/);
                let codesLength = inputCodesLength.split(/\s{0},/);
        
                let L = 0;
                let entropy = 0; 

                if(probabilities.length != codesLength.length){
                    return mInteraction.reply({
                        content: 'フォームに入力された値に不備があります。',
                        ephemeral: true 
                    });
                }

                elementsLength = probabilities.length;

                for(i = 0;i < elementsLength;i++){
                    try{
                        if(probabilities[i].match(/[0-9]{0,}\/[0-9]{0,}/)){
                            probabilities[i] = probabilities[i].split(/\//)[0] / probabilities[i].split(/\//)[1];
                        }
                    }catch(error){}
                    entropy += probabilities[i] * Math.log2(probabilities[i]);
                    L += codesLength[i] * probabilities[i];
                }
                entropy *= -1;
        
                if(entropy == 0 || L == 0 || entropy / L == 0 || entropy == NaN || L == NaN || entropy / L == NaN){
                    return mInteraction.reply({ 
                        content: 'フォームに入力された値に不備があります。', 
                        ephemeral: true 
                    });
                }else{
                    return mInteraction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`エントロピー：${entropy}\n平均符号長：${L}\n能率e：${entropy/L}`)
                                .setColor(7506394)
                        ]
                    });
                }
            })
            .catch(console.error);
    }
};