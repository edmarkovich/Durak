
export class Card {

    static card_to_unicode(card) {
        var base;
        var offset;
        switch (card[0]) {
            case '♠': base = 127137; break;
            case '♥': base = 127153; break;
            case '♦': base = 127169; break;
            case '♣': base = 127185; break;
        }
        switch (card.substring(1)) {
            case 'A': offset = 0; break;
            case 'J': offset = 10; break;
            case 'Q': offset = 12; break;
            case 'K': offset = 13; break;
            default: offset = parseInt(card.substring(1)) - 1;
        }
        return "&#" + (base + offset) + ";";
    }

}