import { Typography, Button, Paper, SvgIcon } from "@mui/material"
import LiquidityPairs from '../../components/ssLiquidityPairs'

import React, { useState, useEffect } from 'react';
import { ACTIONS } from '../../stores/constants';

import stores from '../../stores';
import { useRouter } from "next/router";
import Unlock from '../../components/unlock';

import classes from './liquidity.module.css';
import { useAppThemeContext } from '../../ui/AppThemeProvider';

function Liquidity({ changeTheme }) {

  const accountStore = stores.accountStore.getStore('account');
  const router = useRouter();
  const [account, setAccount] = useState(accountStore);
  const [unlockOpen, setUnlockOpen] = useState(false);

  useEffect(() => {
    const accountConfigure = () => {
      const accountStore = stores.accountStore.getStore('account');
      setAccount(accountStore);
      closeUnlock();
    };
    const connectWallet = () => {
      onAddressClicked();
    };

    stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure);
    stores.emitter.on(ACTIONS.CONNECT_WALLET, connectWallet);
    return () => {
      stores.emitter.removeListener(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure);
      stores.emitter.removeListener(ACTIONS.CONNECT_WALLET, connectWallet);
    };
  }, []);

  const onAddressClicked = () => {
    setUnlockOpen(true);
  };

  const closeUnlock = () => {
    setUnlockOpen(false);
  };

  const {appTheme} = useAppThemeContext();

  return (
    <div className={classes.ffContainer}>
      {account && account.address ?
        <LiquidityPairs />
        :
        <Paper className={classes.notConnectedContent}>
          <div className={classes.contentFloat}>
            <Typography
              style={{
                fontFamily: 'PPNeueMachina UltraBold',
                fontWeight: 700,
                fontSize: 72,
                color: '#ffffff',
              }}>
              Liquidity
            </Typography>

            <div className={classes.mainDescBg}>
              <Typography className={classes.mainDescNC} variant="body2">
                Create a pair or add liquidity to existing stable or volatile Liquidity Pairs.
              </Typography>
            </div>

            <Button
              disableElevation
              className={[classes.buttonConnect, classes[`buttonConnect--${appTheme}`]].join(' ')}
              variant="contained"
              onClick={onAddressClicked}>
              {account && account.address && <div className={`${classes.accountIcon} ${classes.metamask}`}></div>}
            </Button>
          </div>
        </Paper>
       }
       {unlockOpen && <Unlock modalOpen={unlockOpen} closeModal={closeUnlock} />}

    </div>
  );
}

export default Liquidity;
