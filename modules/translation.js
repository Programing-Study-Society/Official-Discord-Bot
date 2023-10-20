const { 
    ActionRowBuilder,
    SlashCommandBuilder,
    TextInputStyle,
    ModalBuilder,
    TextInputBuilder,
    EmbedBuilder,
} = require('discord.js')

const fetch = require('node-fetch-commonjs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ja-en翻訳')
        .setDescription('ja-en翻訳(800字まで)'),
    async execute(interaction){
        const modal = new ModalBuilder()
        .setCustomId('trans')  
        .setTitle('ja-en翻訳(日本語優先,800字まで)');
        
        const ja = new TextInputBuilder()
            .setCustomId('ja')
            .setLabel("日本語")
            .setRequired(false)
            .setStyle(TextInputStyle.Short);
    
        const en = new TextInputBuilder()
            .setCustomId('en')
            .setRequired(false)
            .setLabel("英語")
            .setStyle(TextInputStyle.Short);
                
        modal.addComponents(
            new ActionRowBuilder().addComponents(ja),    
            new ActionRowBuilder().addComponents(en),
        );
        
        await interaction.showModal(modal);
        const filter = (mInteraction) => mInteraction.customId === 'trans';
        interaction.awaitModalSubmit({ filter, time: 600000 })
            .then(async mInteraction => {
                const ja = mInteraction.fields.getTextInputValue('ja');
                const en = mInteraction.fields.getTextInputValue('en');
                const je = "&source_lang=JA&target_lang=EN"
                const ej = "&source_lang=EN&target_lang=JA"

                const trans = async(text,lang) => {
                    const param = {
                        method: "POST"
                    }
                    let URL = "https://api-free.deepl.com/v2/translate"
                    URL += "?auth_key=c0d8d581-03d3-2e33-134d-7328a9757f0f:fx"
                    URL += "&text="+text
                    URL += lang
                    await fetch(URL,param)
                    .then((res) => {
                        res.json().then((res) => {
                            mInteraction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle(`source:\n${text}\n\nresult:\n${res.translations[0].text}`)
                                        .setColor(7506394)
                                ]
                            });
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                }


                if(ja.length != 0 && ja.length <= 800){
                    trans(ja, je)
                }else if(en.length != 0 && en.length <= 800){
                    trans(en, ej)
                }else{
                    return mInteraction.reply({ content: 'フォームが空白で送信されました。', ephemeral: true });
                }

            })
            .catch(console.error);
    }
}