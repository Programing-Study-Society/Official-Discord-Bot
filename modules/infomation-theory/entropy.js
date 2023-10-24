const { 
    ActionRowBuilder,
    SlashCommandBuilder,
    TextInputStyle,
    ModalBuilder,
    TextInputBuilder,
    EmbedBuilder,
} = require('discord.js');


module.exports.entropy = (probabilities) => {
    let ent = 0.0;
    for(let i = 0; i < probabilities.length; i++) {
        if (probabilities[i] === NaN) return NaN;
        ent -= probabilities[i] * Math.log2(probabilities[i]);
    }
    return ent;
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('info-entropy')
        .setDescription('エントロピーの計算'),
    execute: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId('info-entropy')
            .setTitle('平均符号長を求めます');
    
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
                    } else if (ele.match(/^[0-9]{1,}.[0-9]{1,}$/)) {
                        return Number(ele);
                    } else {
                        return NaN;
                    }
                });

                const entropyValue = this.entropy(probabilities);
                
                if( entropyValue == 0 || entropyValue == NaN ){
                    return mInteraction.reply({ 
                        content: 'フォームに入力された値に不備があります。', 
                        ephemeral: true 
                    });
                }else{
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