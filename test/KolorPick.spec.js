import KolorPick from '../src/KolorPick';
import Utils from '../src/utils/Utils';


const container = document.createElement('DIV');
container.className = 'container';
document.body.appendChild(container);


describe('KolorPick unit test', () => {
	describe('Utils unit test', () => {
		it('Utils.precisionRound error handling', done => {
			expect(Utils.precisionRound()).toEqual(new Error('Utils.precisionRound : Missing arguments value or precision'));
			expect(Utils.precisionRound(42)).toEqual(new Error('Utils.precisionRound : Missing arguments value or precision'));
			expect(Utils.precisionRound(null, 42)).toEqual(new Error('Utils.precisionRound : Missing arguments value or precision'));
			expect(Utils.precisionRound('42', '42')).toEqual(new Error('Utils.precisionRound : Invalid type for value or precision'));
			expect(Utils.precisionRound(42, '42')).toEqual(new Error('Utils.precisionRound : Invalid type for value or precision'));
			expect(Utils.precisionRound('42', 42)).toEqual(new Error('Utils.precisionRound : Invalid type for value or precision'));
			done();
		});

		it('Utils.precisionRound standard behavior', done => {
			expect(Utils.precisionRound(1 / 3, 0)).toEqual(0);
			expect(Utils.precisionRound(1 / 3, 3)).toEqual(0.333);
			expect(Utils.precisionRound(1 / 3, 6)).toEqual(0.333333);
			expect(Utils.precisionRound(-(1 / 3), 3)).toEqual(-0.333);
			expect(Utils.precisionRound(-(1 / 3), 6)).toEqual(-0.333333);
			expect(Utils.precisionRound(42, 6)).toEqual(42);
			expect(Utils.precisionRound(-42, 6)).toEqual(-42);
			expect(Utils.precisionRound(90071992547409911, 6)).toEqual(90071992547409911);
			done();
		});
	});
});
