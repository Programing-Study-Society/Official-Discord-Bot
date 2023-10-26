const { 
    ActionRowBuilder,
    SlashCommandBuilder,
    TextInputStyle,
    ModalBuilder,
    TextInputBuilder,
    EmbedBuilder,
} = require('discord.js');


module.exports = {
    meanSignLength: (codesLength, probabilities) => {
        let elementsLength = probabilities.length;
        let L = 0.0;
        for(let i = 0;i < elementsLength; i++){
            if (probabilities[i] === NaN) return NaN;
            L += codesLength[i] * probabilities[i];
        }
        return L;
    },

    data: new SlashCommandBuilder()
        .setName('info-meansignlength')
        .setDescription('平均符号長の計算'),

    execute: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId('info-meansignlength')  
            .setTitle('平均符号長を求めます');
    
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
        const filter = (mInteraction) => mInteraction.customId === 'info-meansignlength';
        interaction.awaitModalSubmit({ filter, time: 600000 })
            .then(async (mInteraction) => {
                const inputProbabilities = mInteraction.fields.getTextInputValue('probabilities');
                const inputCodesLength = mInteraction.fields.getTextInputValue('codes-length');
        
                let probabilities = inputProbabilities.split(/,\s{0,}/);
                let codesLength = inputCodesLength.split(/,\s{0,}/);

                if(probabilities.length != codesLength.length){
                    return mInteraction.reply({
                        content: 'フォームに入力された値に不備があります。',
                        ephemeral: true 
                    });
                }

                probabilities = probabilities.map((ele) => {
                    if(ele.match(/^[0-9]{1,}\/[0-9]{1,}$/)){
                        return Number(ele.split(/\//)[0]) / Number(ele.split(/\//)[1]);
                    } else if (ele.match(/^[0-9]{1,}.[0-9]{1,}$/)) {
                        return Number(ele);
                    } else {
                        return NaN;
                    }
                });

                const meanSignLengthValue = module.exports.meanSignLength(codesLength, probabilities);
                
                if( meanSignLengthValue == 0 || meanSignLengthValue == NaN ){
                    return mInteraction.reply({ 
                        content: 'フォームに入力された値に不備があります。', 
                        ephemeral: true 
                    });
                }else{
                    return mInteraction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`平均符号長：${meanSignLengthValue}`)
                                .setColor(7506394)
                        ]
                    });
                }
            })
            .catch(console.error);
    }
};