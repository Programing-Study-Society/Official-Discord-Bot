const { 
    ActionRowBuilder,
    SlashCommandBuilder,
    TextInputStyle,
    ModalBuilder,
    TextInputBuilder,
    EmbedBuilder,
} = require('discord.js');


const {
    isPerfectEventSystem,
    optimizeProbabilities
} = require('./info-theory-function');


const meanSignLengthFile = require('./mean-sign-length');
const entropyFile = require('./entropy');


module.exports = {
    efficiency: (codesLength, arg_probabilities) => {

        let probabilities = optimizeProbabilities(arg_probabilities);

        // 完全事象系以外を除外
        if (!isPerfectEventSystem(probabilities)) return NaN;

        const meanSignLengthValue = meanSignLengthFile.meanSignLength(codesLength, probabilities);
        const entropyValue = entropyFile.entropy(probabilities);

        if (isNaN(meanSignLengthValue) || meanSignLengthValue === 0 || isNaN(entropyValue)) return NaN;

        return entropyValue / meanSignLengthValue;
    },

    data: new SlashCommandBuilder()
        .setName('info-efficiency')
        .setDescription('能率の計算'),

    execute: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId('info-efficiency')  
            .setTitle('能率を求めます');
    
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
        const filter = (mInteraction) => mInteraction.customId === 'info-efficiency';
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
                    } else if (ele.match(/^[0-9]{1,}\.[0-9]{1,}$/) || ele === '0' || ele === '1') {
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

                const efficiencyValue = module.exports.efficiency(codesLength, probabilities);
                
                if(isNaN(efficiencyValue)){
                    return mInteraction.reply({ 
                        content: 'フォームに入力された値に不備があります。', 
                        ephemeral: true 
                    });
                }else{
                    console.log(`efficiency : ${efficiencyValue}`);
                    return mInteraction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`能率e：${efficiencyValue}`)
                                .setColor(7506394)
                        ]
                    });
                }
            })
            .catch(console.error);
    }
};