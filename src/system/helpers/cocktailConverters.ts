import * as modelContracts from "../../model/modelContracts";

export default class cocktailConverter {

    public cocktailToCard(cocktails: modelContracts.ICocktail[]): modelContracts.heroCard[] {
        var cards: modelContracts.heroCard[] = [];

        cocktails.forEach(cocktail => {

            var card: modelContracts.heroCard = {
                title: cocktail.title,
                subtitle: '',
                text: cocktail.instructions + '\n\r\n ' + cocktail.ingredients.join(' \r\n '),
                images: [cocktail.image],
                buttons: [[`Show me details on ${cocktail.id}`, "Show More"]]
            };

            if (card.text.indexOf('undefined') != -1) {
                card.text = '';
            }

            cards.push(card);
        });

        return cards;
    }
}