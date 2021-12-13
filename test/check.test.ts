import * as minterSdk from '../src';
import {Wallet} from '../src';
import {IssueCheckParams} from '../src/check/check';

const MNEMONIC = 'solar when satoshi champion about zebra crop solution leopard senior ability vocal';

//
test('[Check] Issue Check', async () => {
  const CHECK_ENCODED = 'Mcf8993102843b9ac9ff80893635c9adc5dea0000080b841ecdb48f068fbb9329cc0e00508c163e09401b1365c4729aace9d4aabe244f28258341363d4a5c21e108db26a825b9685608345725e45adcc653f5c6683dc7ef3001ba0c85de3074022bdb453165a89d9ab7a2ed3be1e1782e6ed7ec846aa0df7a360b5a0712b180bc166009ec3b48bbdc50892b35289fa3191ee48ca7b14d3483b73282b';
  const CHECK_PASSWD = '123456';

  const utils = minterSdk.utils;

  const chain = new minterSdk.Chain('testnet');

  const check = new minterSdk.Check({
    nonce   : 49,
    coin    : 0,
    value   : utils.convertBipToPip(1_000),
    dueBlock: minterSdk.constants.MINTER_LAST_BLOCK_HEIGHT,
    chainId : chain.networkId,
  } as IssueCheckParams);

  const wal = await Wallet.fromMnemonic(MNEMONIC);
  const keyPair = await wal.getAccountKeyPair();

  check.setLock(CHECK_PASSWD).sign(keyPair);

  expect(check.valid()).toBeTruthy();
  expect(check.toString()).toEqual(CHECK_ENCODED);
});

//
test('[Check] Restore Check from string ', async () => {
  const CHECK_ENCODED = 'Mcf8993102843b9ac9ff80893635c9adc5dea0000080b841ecdb48f068fbb9329cc0e00508c163e09401b1365c4729aace9d4aabe244f28258341363d4a5c21e108db26a825b9685608345725e45adcc653f5c6683dc7ef3001ba0c85de3074022bdb453165a89d9ab7a2ed3be1e1782e6ed7ec846aa0df7a360b5a0712b180bc166009ec3b48bbdc50892b35289fa3191ee48ca7b14d3483b73282b';
  const CHECK_HASH = 'f6280b8cdadc8eff5abc9613403e8407dac8a8890c842943cefdda20de2093c4';
  const check = new minterSdk.Check(CHECK_ENCODED);

  expect(check.valid()).toBeTruthy();
  expect(check.hash(true).toString('hex')).toEqual(CHECK_HASH);
});

//
test('[Check] Check proof', async () => {
  const CHECK_ENCODED = 'Mcf8993102843b9ac9ff80893635c9adc5dea0000080b841ecdb48f068fbb9329cc0e00508c163e09401b1365c4729aace9d4aabe244f28258341363d4a5c21e108db26a825b9685608345725e45adcc653f5c6683dc7ef3001ba0c85de3074022bdb453165a89d9ab7a2ed3be1e1782e6ed7ec846aa0df7a360b5a0712b180bc166009ec3b48bbdc50892b35289fa3191ee48ca7b14d3483b73282b';
  const CHECK_PASSWD = '123456';
  const REDEEMER_ADDRESS = 'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910';
  const CHECK_PROOF = 'd4e0f800d8b7ece6c66a1453c8633e6d62ba55b946fa380fd320c8a9ddee2db64b99a31cedde75eec2c9ed1300bb01af249f4732e31d64420dff23c30c152f7400';

  const check = new minterSdk.Check(CHECK_ENCODED);
  const proof = minterSdk.Check.getProof(CHECK_PASSWD, REDEEMER_ADDRESS);

  expect(check.valid()).toBeTruthy();
  expect(proof.toString('hex')).toEqual(CHECK_PROOF);
});
