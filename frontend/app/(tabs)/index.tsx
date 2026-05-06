import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a0b2e" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- Header Section --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.personalText}>Personal</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.username}>Zini</Text>
              <Ionicons name="chevron-down" size={16} color="white" style={{ marginLeft: 5 }} />
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="comment-question-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              <View style={styles.redDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Balance Section --- */}
        <View style={styles.balanceSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.balanceLabel}>Total balance</Text>
            <MaterialCommunityIcons name="shield-check-outline" size={16} color="#6b7280" style={{ marginLeft: 5 }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Text style={styles.balanceAmount}>RM100.00</Text>
            <Ionicons name="eye-outline" size={20} color="white" style={{ marginLeft: 10 }} />
          </View>
          <TouchableOpacity>
            <Text style={styles.balanceInfo}>Balance info &gt;</Text>
          </TouchableOpacity>
        </View>

        {/* --- Action Buttons (Add, Scan, Send) --- */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIconBg}>
              <Ionicons name="add" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>Add money</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIconBg}>
              <MaterialCommunityIcons name="qrcode-scan" size={20} color="white" />
            </View>
            <Text style={styles.actionText}>Scan QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIconBg}>
              <Ionicons name="send" size={20} color="white" />
            </View>
            <Text style={styles.actionText}>Send money</Text>
          </TouchableOpacity>
        </View>

        {/* --- Your Everyday Account Section --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your everyday account</Text>
          <MaterialCommunityIcons name="credit-card-outline" size={24} color="#6b7280" />
        </View>

        <View style={styles.cardsContainer}>
          {/* Main Account Card */}
          <View style={[styles.card, styles.mainCard]}>
            <Text style={styles.cardLabel}>Main account</Text>
            <Text style={styles.cardAmount}>RM20.00</Text>
            <TouchableOpacity style={styles.bottomLink}>
              <Text style={styles.cardLinkText}>View transactions</Text>
            </TouchableOpacity>
          </View>

          {/* Pockets Card */}
          <View style={[styles.card, styles.pocketCard]}>
            <Text style={styles.cardLabelBold}>Pockets</Text>
            <Text style={styles.cardSubText}>Earn up to 3.55% p.a.</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Up to 3.55% p.a.</Text>
            </View>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* --- Bottom Navigation Bar --- */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="gift-outline" size={24} color="#6b7280" />
          <Text style={styles.navText}>Rewards</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerNavContainer}>
          <View style={styles.centerNavInner}>
            <MaterialCommunityIcons name="lightning-bolt" size={28} color="white" />
          </View>
          <Text style={styles.centerNavText}>SamaSave</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid-outline" size={24} color="#6b7280" />
          <Text style={styles.navText}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#6b7280" />
          <Text style={styles.navText}>Me</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11081f', // Dark purple/black background
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Space for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  personalText: {
    color: '#9ca3af',
    fontSize: 12,
    backgroundColor: '#2d1b4e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  username: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 8,
    height: 8,
    backgroundColor: 'red',
    borderRadius: 4,
  },
  balanceSection: {
    marginTop: 30,
  },
  balanceLabel: {
    color: '#e5e7eb',
    fontSize: 14,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  balanceInfo: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1f1b2e',
    borderRadius: 20,
    paddingVertical: 20,
    marginTop: 25,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIconBg: {
    backgroundColor: '#7c3aed', // Bright purple
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#1f1b2e',
    borderRadius: 16,
    padding: 15,
    width: '48%',
    height: 160,
  },
  mainCard: {
    justifyContent: 'space-between',
  },
  pocketCard: {
    justifyContent: 'flex-start',
  },
  cardLabel: {
    color: '#9ca3af',
    fontSize: 12,
  },
  cardLabelBold: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardAmount: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  cardSubText: {
    color: '#e5e7eb',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#22d3ee',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#083344',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bottomLink: {
    marginTop: 'auto',
  },
  cardLinkText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  createButton: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 'auto',
  },
  createButtonText: {
    color: 'white',
    fontSize: 12,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#11081f',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#2d1b4e',
  },

  centerNavContainer: {
    alignItems: 'center',
    marginTop: -25, 
  },
  centerNavInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#f43f5e', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#11081f', 
  },
  centerNavText: {
    color: '#f43f5e', 
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },

  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 4,
  },
  navTextActive: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
  },
});