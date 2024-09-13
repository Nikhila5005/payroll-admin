'use client'
import * as React from 'react';
import { Box, Grid, Card, CardContent, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link'; // Ensure Link is imported
import { MoneyOff, AttachMoney, AccountBalance } from '@mui/icons-material'; // Import icons
export default function Payslip() {
  const styles = {
    body: {
      backgroundColor: 'white',
    },
    container: {
      width: '1200px',
      padding: 0,
      marginRight: 'auto',
      marginLeft: 'auto',
    },
    gradientCards: {
      display: 'flex', // Changed to flex for alignment in the same row
      justifyContent: 'space-between', // Space between cards
      padding: '30px',
    },
    containerTitle: {
      textAlign: 'center',
      padding: 0,
      marginBottom: '40px',
      fontSize: '40px',
      color: '#fff',
      fontWeight: 600,
      lineHeight: '60px',
    },
    card: {
      maxWidth: '300px', // Card width remains the same
      height: '200px', // Reduced height of cards
      border: 0,
      width: '100%',
      marginInline: 'auto',
    },
    containerCard: {
      position: 'relative',
      border: '2px solid transparent',
      background: 'linear-gradient(71deg, #080509, #1A171C, #080509)',
      backgroundClip: 'padding-box',
      borderRadius: '45px',
      padding: '40px',
    },
    cardTitle: {
      textAlign: 'center',
      fontWeight: 600,
      color: 'white',
      letterSpacing: '-0.02em',
      lineHeight: '40px',
      fontSize: '28px',
      paddingBottom: '8px',
    },
    cardDescription: {
      textAlign: 'center',
      fontWeight: 600,
      lineHeight: '32px',
      color: 'hsla(0, 0%, 100%, 0.5)',
      fontSize: '16px',
      maxWidth: '470px',
    },
    bgGreenBox: {
      position: 'relative',
      background: 'linear-gradient(71deg, #0D1212, #3DA077, #0D1212)',
      borderRadius: '45px',
      padding: '20px', // Added padding for better alignment
    },
    bgWhiteBox: {
      position: 'relative',
      background: 'linear-gradient(71deg, #121013, #B0AFB0, #121013)',
      borderRadius: '45px',
      padding: '20px', // Added padding for better alignment
    },
    bgYellowBox: {
      position: 'relative',
      background: 'linear-gradient(71deg, #110E0E, #AFA220, #110E0E)',
      borderRadius: '45px',
      padding: '20px', // Added padding for better alignment
    },
  };
  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.containerTitle}>
          <h1 style={{ color: 'black' }}>Payslip</h1>
        </div>
        {/* 3 Cards */}
        <div style={styles.gradientCards}>
          {/* New Card 1 */}
          <Link href="/pages/Payslip/templet1" style={{ textDecoration: 'none' }}> {/* Added Link */}
            <div style={styles.card}>
              <div style={styles.bgGreenBox}>
                <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* SVG content */}
                </svg>
                <p style={styles.cardTitle}>Payslip design 1</p>
                <p style={styles.cardDescription}>Mantha tech</p>
              </div>
            </div>
          </Link>
          {/* New Card 2 */}
          <Link href="/pages/Payslip/templet2" style={{ textDecoration: 'none' }}> {/* Added Link */}
            <div style={styles.card}>
              <div style={styles.bgWhiteBox}>
                <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* SVG content */}
                </svg>
                <p style={styles.cardTitle}>Payslip design 2</p>
                <p style={styles.cardDescription}>Mantha tech 2</p>
              </div>
            </div>
          </Link>
          {/* New Card 3 */}
          <Link href="/pages/Payslip/templet3" style={{ textDecoration: 'none' }}> {/* Added Link */}
            <div style={styles.card}>
              <div style={styles.bgYellowBox}>
                <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* SVG content */}
                </svg>
                <p style={styles.cardTitle}>Payslip design 3</p>
                <p style={styles.cardDescription}>Mantha tech 3</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}