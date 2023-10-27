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


module.exports = {
    entropy: (arg_probabilities) => {

        let probabilities = optimizeProbabilities(arg_probabilities);
        
        const filterBy1 = probabilities.filter(ele => ele === 1);
        const filterBy0 = probabilities.filter(ele => ele === 0);
        
        // 確率が0を含む場合
        if (filterBy0.length > 0) {
            if (filterBy1.length === 1 && filterBy0.length === 1) {
                return 0;
            } else {
                return NaN;
            }
        }

        if (!isPerfectEventSystem(probabilities)) return NaN;

        let ent = 0.0;
        for(let i = 0; i < probabilities.length; i++) {
            ent -= (probabilities[i] * Math.log2(probabilities[i]));
        }
        return ent;
    },

    data: new SlashCommandBuilder()
        .setName('info-entropy')
        .setDescription('エントロピーの計算'),

    execute: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId('info-entropy')
            .setTitle('エントロピーを求めます');
    
        const probabilitiesForm = new TextInputBuilder()
            .setCustomId('probabilities')
            .setLabel("各事象の確率 ( 半角数字 ,区切り )")
            .setStyle(TextInputStyle.Short);
                
        modal.addComponents(
            new ActionRowBuilder().addComponents(probabilitiesForm)
        );
        
        await interaction.showModal(modal);
        const filter = (mInteraction) => mInteraction.customId === 'info-entropy';
        interaction.awaitModalSubmit({ filter, time: 600000 })
            .then(async (mInteraction) => {
                const inputProbabilities = mInteraction.fields.getTextInputValue('probabilities');
        
                let probabilities = inputProbabilities.split(/,\s{0,}/);

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

                if (typeof probabilities === 'number') probabilities = [probabilities];

                const entropyValue = module.exports.entropy(probabilities);
                
                if( isNaN(entropyValue) ){
                    return mInteraction.reply({ 
                        content: 'フォームに入力された値に不備があります。', 
                        ephemeral: true 
                    });
                }else{
                    console.log(`entropy : ${entropyValue}`);
                    return mInteraction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`エントロピー：${entropyValue}`)
                                .setColor(7506394)
                        ]
                    });
                }
            })
            .catch(console.error);
    }
};