const { 
    ActionRowBuilder,
    SlashCommandBuilder,
    TextInputStyle,
    ModalBuilder,
    TextInputBuilder,
    EmbedBuilder,
} = require('discord.js')

const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('文字数カウント')
        .setDescription('文字数カウントできます。'),
    async execute(interaction){
        const modal = new ModalBuilder()
        .setCustomId('count')  
        .setTitle('文字数カウント');
        
        const text = new TextInputBuilder()
            .setCustomId('text')
            .setLabel("本文")
            .setStyle(TextInputStyle.Short);
                
        modal.addComponents(
            new ActionRowBuilder().addComponents(text),    
        );
        
        await interaction.showModal(modal);
        const filter = (mInteraction) => mInteraction.customId === 'count';
        interaction.awaitModalSubmit({ filter, time: 600000 })
            .then(async mInteraction => {
                const text = mInteraction.fields.getTextInputValue('text');
                const emtext = text.slice(0,100) + "...";
                return mInteraction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`文字数：${text.length}\n\n本文：${emtext}`)
                            .setColor(7506394)
                    ]
                })

            })
            .catch(console.error);
    }
}