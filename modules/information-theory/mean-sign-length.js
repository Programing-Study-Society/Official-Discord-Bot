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
        
        const filterBy1 = probabilities.filter(ele => ele === 1);
        const filterBy0 = probabilities.filter(ele => ele === 0);

        // 完全事象系以外を除外
        let sum = 0;
        for(let i = 0; i < probabilities.length; i++) {
            sum += probabilities[i];
        }

        if (sum !== 1) return NaN;
        if ((filterBy0.length > 0 && filterBy1.length !== 1) || filterBy0.length > 1) return NaN;

        let L = 0.0;
        for(let i = 0;i < probabilities.length; i++){
            L += codesLength[i] * probabilities[i];
        }
        return L;
    },

    data: new SlashCommandBuilder()
        .setName('info-mean_sign_length')
        .setDescription('平均符号長の計算'),

    execute: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId('infomeansignlength')  
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
                    } else if (ele.match(/^[0-9]{1,}.[0-9]{1,}$/) || ele === '0' || ele === '1') {
                        return Number(ele);
                    } else {
                        return NaN;
                    }
                });

                if (probabilities.includes(NaN)) {
                    return mInteraction.reply({ 
                        content: 'フォームに入力された値に不備があります。', 
                        ephemeral: true 
                    });
                }

                const meanSignLengthValue = module.exports.meanSignLength(codesLength, probabilities);
                
                if( meanSignLengthValue < 1 || isNaN(meanSignLengthValue) ){
                    return mInteraction.reply({ 
                        content: 'フォームに入力された値に不備があります。', 
                        ephemeral: true 
                    });
                }else{
                    console.log(`mean sign length : ${meanSignLengthValue}`);
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