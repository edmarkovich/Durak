import chai from 'chai'
const {expect} = chai

import {Game} from "../game.js"

describe ('Play Full Game', () => {
    let game = new Game(['Ed', 'David', 'Jamie'])
    
    it('should init game', () => {
        expect(Object.keys(game.players).length).to.equal(3)
        expect(Object.keys(game.deck.cards).length).to.equal(36-6-6-6)
        expect(game.players["Ed"].cards.length).to.eq(6)
        expect(game.players["David"].cards.length).to.eq(6)
        expect(game.players["Jamie"].cards.length).to.eq(6)
        expect(game.state).to.equal("empty table")
        expect(game.first_attacker).to.eq("Ed")
        expect(game.attacker).to.eq("Ed")
        expect(game.defender).to.eq("David")
        expect(game.error).is.null
    })

    describe('empty table', ()=> {
        it('should reject bad player', () => {
            game.process_input("Bad Name", "play", "X")
            expect(game.error).to.eq("Unexpected player: Bad Name. Expecting: Ed")
            expect(game.state).to.eq("empty table")
        })
        it('should reject bad verb', () => {
            game.process_input("Ed", "pass", "X")
            expect(game.error).to.eq("Unexpected verb: pass. Expecting: play")
            expect(game.state).to.eq("empty table")
        })
        it('should reject missing card', () => {
            game.process_input("Ed", "play", "♥J")
            expect(game.error).to.eq("Player Ed does not have card ♥J")
            expect(game.state).to.eq("empty table")
        })
        it('should accept valid move', () => {
            game.process_input("Ed", "play", "♣Q")
            expect(game.error).is.null
            expect(game.state).to.eq("attack in progress")
        })
    })

    describe('attack in progress - beat one - not trump', () => {
        it('should reject bad player', ()=> {
            game.process_input("Ed", "play", "X")
            expect(game.error).to.eq("Unexpected player: Ed. Expecting: David")
            expect(game.state).to.eq("attack in progress")          
        })
        it('should reject bad verb', () => {
            game.process_input("David", "pass", "X")
            expect(game.error).to.eq("Unexpected verb: pass. Expecting: play,take")
            expect(game.state).to.eq("attack in progress")
        })
        it('should reject missing card', () => {
            game.process_input("David", "play", "♣6")
            expect(game.error).to.eq("Player David does not have card ♣6")
            expect(game.state).to.eq("attack in progress")
        })
        it('should reject weaker card', () => {
            game.process_input("David", "play", "♣8")
            expect(game.error).to.eq("Card ♣8 does not beat the table card")
            expect(game.state).to.eq("attack in progress")
        })
        it('should accept stronger card', () => {
            game.process_input("David", "play", "♣A")
            expect(game.players["Ed"].cards.length).to.eq(5)
            expect(game.players["David"].cards.length).to.eq(5) 
            expect(game.error).is.null
            expect(game.state).to.eq("beat one")
        })
    })
    describe("beat one - pass", () => {
        it('should reject bad player', ()=> {
            game.process_input("David", "play", "X")
            expect(game.error).to.eq("Unexpected player: David. Expecting: Ed")
            expect(game.state).to.eq("beat one")          
        })
        it('should reject bad verb', () => {
            game.process_input("Ed", "take", "X")
            expect(game.error).to.eq("Unexpected verb: take. Expecting: play,pass")
            expect(game.state).to.eq("beat one")       
        })
        it('should accept first pass', () => {
            game.process_input("Ed", "pass", "X")
            expect(game.error).is.null
            expect(game.state).to.eq("passed on attack")
            expect(game.passers).to.eql(['Ed']) 
            expect(game.first_attacker).to.eq("Ed")
            expect(game.attacker).to.eq("Jamie")      
        })
    })

    describe("passed on attack - everyone passes", () => {
        it('should accept subsequent pass', () => {
            game.process_input("Jamie", "pass", "X")
            expect(game.error).is.null
            expect(game.state).to.eq("empty table")   
            expect(game.players["Ed"].cards.length).to.eq(6)
            expect(game.players["David"].cards.length).to.eq(6)  
            expect(game.first_attacker).to.eq("David")
            expect(game.attacker).to.eq("David")
            expect(game.defender).to.eq("Jamie")
            expect(Object.keys(game.deck.cards).length).to.equal(16)
            expect(game.table.done_pile.length).to.eq(2)
        })
    })

    describe("ability to add in cards / take ", () => {
        it('should accept additional cards from another player', () => {
            game.process_input('David', "play", "♦10")
            expect(game.state).to.eq("attack in progress")

            game.process_input('Jamie', "play", "♥7")
            expect(game.state).to.eq("beat one")

            game.process_input('David', "pass", "♥10")
            expect(game.state).to.eq("passed on attack")

            game.process_input('Ed', "play", "♥10")
            expect(game.state).to.eq("attack in progress")

            expect(game.players["Ed"].cards.length).to.eq(5)
            expect(game.players["Jamie"].cards.length).to.eq(5)
            expect(game.players["David"].cards.length).to.eq(5)

            game.process_input('Jamie', "take", "")
            expect(game.state).to.eq("taking")

            game.process_input('Ed', "pass", "")
            expect(game.state).to.eq("passed on add")

            game.process_input('David', "pass", "")
            expect(game.state).to.eq("empty table")

            expect(game.players["Ed"].cards.length).to.eq(6)
            expect(game.players["Jamie"].cards.length).to.eq(8)
            expect(game.players["David"].cards.length).to.eq(6)

            expect(Object.keys(game.deck.cards).length).to.equal(14)
            expect(game.first_attacker).to.eq("Ed") 
            expect(game.defender).to.eq("David")
        })
    })

    describe("more rounds", () => {
        it('should play a big attack with lots of adds and a take', () => {
            game.process_input("Ed", "play", "♠7")
            game.process_input("David", "play", "♥J")
            game.process_input("Ed", "play", "♣7")
            game.process_input("David", "play", "♣8")
            game.process_input("Ed", "play", "♦7")
            game.process_input("David", "play", "♦J")
            game.process_input("Ed", "pass", "")
            game.process_input("Jamie", "play", "♣J")
            game.process_input("David", "take", "")
            game.process_input("Jamie", "play", "♠8")
            game.process_input("Jamie", "pass", "")

            expect(game.players["Ed"].cards.length).to.eq(3)
            expect(game.players["Jamie"].cards.length).to.eq(6)
            expect(game.players["David"].cards.length).to.eq(3)
            

            game.process_input("Ed", "pass", "")
            expect(game.state).to.eq("empty table")

            expect(game.players["Ed"].cards.length).to.eq(6)
            expect(game.players["Jamie"].cards.length).to.eq(6)
            expect(game.players["David"].cards.length).to.eq(11)

            expect(Object.keys(game.deck.cards).length).to.equal(11)
            expect(game.first_attacker).to.eq("Jamie") 
            expect(game.defender).to.eq("Ed")

        })

        it('should play a big attack with lots of adds and use trump and beat done', () => {
            game.process_input("Jamie", "play", "♠10")
            game.process_input("Ed", "play", "♠Q")

            game.process_input("Jamie", "play", "♣10")
            game.process_input("Ed", "play", "♥8")

            game.process_input("Jamie", "play", "♦10")
            game.process_input("Ed", "play", "♦Q")

            game.process_input("Jamie", "play", "♥10")
            game.process_input("Ed", "play", "♥K")

            game.process_input("Jamie", "pass", "")
            expect(game.players["Ed"].cards.length).to.eq(2)
            expect(game.players["Jamie"].cards.length).to.eq(2)
            expect(game.players["David"].cards.length).to.eq(11)

            game.process_input("David", "pass", "")
            expect(game.players["Ed"].cards.length).to.eq(6)
            expect(game.players["Jamie"].cards.length).to.eq(6)
            expect(game.players["David"].cards.length).to.eq(11)

            expect(Object.keys(game.deck.cards).length).to.equal(3)
            expect(game.table.done_pile.length).to.eq(10)

            expect(game.first_attacker).to.eq("Ed") 
            expect(game.defender).to.eq("David")
        })

        it('should automatically "take done" when 6 cards played', () => {
            game.process_input("Ed", "play", "♠6")
            game.process_input("David", "play", "♠9")
            game.process_input("Ed", "pass", "")

            game.process_input("Jamie", "play", "♦6")
            game.process_input("David", "play", "♦7")

            game.process_input("Jamie", "play", "♦9")
            game.process_input("David", "play", "♦J")

            game.process_input("Jamie", "play", "♥6")
            game.process_input("David", "play", "♥J")

            game.process_input("Jamie", "play", "♥9")
            game.process_input("David", "take", "")

            expect(game.players["Ed"].cards.length).to.eq(5)
            expect(game.players["Jamie"].cards.length).to.eq(2)
            expect(game.players["David"].cards.length).to.eq(7)

            game.process_input("Jamie", "play", "♥7")
            expect(game.state).to.eq("empty table")

            expect(game.players["Ed"].cards.length).to.eq(6)
            expect(game.players["Jamie"].cards.length).to.eq(3)
            expect(game.players["David"].cards.length).to.eq(17)
            expect(Object.keys(game.deck.cards).length).to.equal(0)
        })

        it('just moves tests forward', () => {
            game.process_input("Jamie", "play", "♠J")   
            game.process_input("Ed", "play", "♠A")   

            game.process_input("Jamie", "play", "♥A")   
            game.process_input("Ed", "take", "") 
            game.process_input("Jamie", "pass", "")

            game.process_input("David", "play", "♦J")   
            game.process_input("David", "pass", "")

            game.process_input("Jamie", "pass", "")  
            expect(game.error).is.null 
            expect(game.state).to.eq("empty table")
            expect(game.players["Ed"].cards.length).to.eq(9)
            expect(game.players["Jamie"].cards.length).to.eq(1)
            expect(game.players["David"].cards.length).to.eq(16)

            expect(game.first_attacker).to.eq("David") 
            expect(game.defender).to.eq("Jamie")
        })

        it('round over when player out of cards', () => {
            game.process_input("David", "play", "♣6")   
            game.process_input("Jamie", "play", "♥Q")
            expect(game.state).to.eq("empty table")
            expect(game.players["Ed"].cards.length).to.eq(9)
            expect(game.players["Jamie"].cards.length).to.eq(0)
            expect(game.players["David"].cards.length).to.eq(15)
            expect(game.table.done_pile.length).to.eq(12)
            expect(game.first_attacker).to.eq("Ed") 
            expect(game.defender).to.eq("David")
        })

        it('two player duel - beat', () => {
            game.process_input("Ed", "play", "♦8")   
            game.process_input("David", "play", "♦9")   
            game.process_input("Ed", "pass", "")   
            expect(game.state).to.eq("empty table")
            expect(game.players["Ed"].cards.length).to.eq(8)            
            expect(game.players["David"].cards.length).to.eq(14)
            expect(game.table.done_pile.length).to.eq(14)
        })

        it('two player duel - take, auto-take at 6', () => {
            game.process_input("David", "play", "♦7") 
            game.process_input("Ed", "play", "♦J")

            game.process_input("David", "play", "♣7") 
            game.process_input("Ed", "play", "♣K")

            game.process_input("David", "play", "♠7") 
            game.process_input("Ed", "play", "♠J")

            game.process_input("David", "play", "♣J") 
            game.process_input("Ed", "play", "♥A")

            game.process_input("David", "play", "♥7")   
            game.process_input("Ed", "take", "")   

            game.process_input("David", "play", "♥J")             
            expect(game.state).to.eq("empty table")

            expect(game.players["Ed"].cards.length).to.eq(14)            
            expect(game.players["David"].cards.length).to.eq(8)

            expect(game.first_attacker).to.eq("David") 
            expect(game.defender).to.eq("Ed")
        })

        it('two player duel - moving game forward', () => {
            game.process_input("David", "play", "♣8") 
            game.process_input("Ed", "play", "♣J")

            game.process_input("David", "play", "♠8") 
            game.process_input("Ed", "play", "♠J")

            game.process_input("David", "pass", "") 
            expect(game.state).to.eq("empty table")

            expect(game.players["Ed"].cards.length).to.eq(12)
            expect(game.players["David"].cards.length).to.eq(6)            
            
            expect(game.table.done_pile.length).to.eq(18)

            expect(game.first_attacker).to.eq("Ed") 
            expect(game.defender).to.eq("David")
        })

        it('two player duel - moving game forward2', ()=>{
            game.process_input("Ed", "play", "♠7")
            game.process_input("David", "play", "♠9")

            game.process_input("Ed", "play", "♣7")
            game.process_input("David", "play", "♣9")

            game.process_input("Ed", "play", "♦7")
            game.process_input("David", "play", "♥6")  

            game.process_input("Ed", "play", "♥7")  
            game.process_input("David", "play", "♥9") 

            game.process_input("Ed", "pass", "")  
            expect(game.state).to.eq("empty table")

            expect(game.players["Ed"].cards.length).to.eq(8)            
            expect(game.players["David"].cards.length).to.eq(2)
            expect(game.table.done_pile.length).to.eq(26)
            expect(game.first_attacker).to.eq("David") 
            expect(game.defender).to.eq("Ed")
        })

        it('should win the game', () => {
            game.process_input("David", "play", "♦6")
            game.process_input("Ed", "play", "♦K")

            game.process_input("David", "play", "♠6")
            game.process_input("Ed", "play", "♠K")
            expect(game.state).to.eq("game over")

        })

    })

})