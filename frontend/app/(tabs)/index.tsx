import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Modal, Alert, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  // Modal visibility states
  const [showWarning, setShowWarning] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false); 
  
  // Tab and squad selection states
  const [activeTab, setActiveTab] = useState('Home');
  const [activeSquad, setActiveSquad] = useState('All');
  
  // ==========================================
  // CORE FINANCIAL STATES
  // ==========================================
  const [totalBalance, setTotalBalance] = useState(1500.00); // Actual total balance for Home
  const [samaSaveBalance, setSamaSaveBalance] = useState(15.50); // Accumulated penalty in Vault
  const [aiMode, setAiMode] = useState('Strict'); // AI Sensitivity Mode
  
  // Initial squad list
  const [squads, setSquads] = useState([
    { id: 'Besties', name: '👯‍♀️ Besties' },
    { id: 'Family', name: '🏠 Family' },
    { id: 'JapanTrip', name: '✈️ Japan 2026' }
  ]);
  
  // Create form states
  const [squadName, setSquadName] = useState('');
  const [squadGoalAmount, setSquadGoalAmount] = useState(''); 
  const [inviteMichelle, setInviteMichelle] = useState(false);
  const [inviteXinying, setInviteXinying] = useState(false); 
  const [editGoalAmount, setEditGoalAmount] = useState('');

  // Dynamic state for members avatars with full names
  const [membersData, setMembersData] = useState<any>({
    Besties: [
      { id: 'z', name: 'Zini (You)', initial: 'Z', color: '#7c3aed' },
      { id: 'x', name: 'Xinying', initial: 'X', color: '#f43f5e' },
      { id: 'm', name: 'Michelle', initial: 'M', color: '#22d3ee' }
    ],
    Family: [
      { id: 'z', name: 'Zini (You)', initial: 'Z', color: '#7c3aed' }
    ],
    JapanTrip: [
      { id: 'z', name: 'Zini (You)', initial: 'Z', color: '#7c3aed' }
    ]
  });

  // Dynamic shared goals for Sync-Pockets
  const [squadGoals, setSquadGoals] = useState<any>({
    Besties: { title: 'KL Trip Fund', current: 1200, target: 2000 },
    Family: { title: 'New TV Fund', current: 800, target: 3000 },
    JapanTrip: { title: 'Osaka Universal Studio', current: 4500, target: 8000 }
  });

  // Activity feed data
  const activityData: any = {
    Besties: [
      { id: 1, user: 'Michelle', msg: 'paid RM5.50 Sin Tax for 2AM McDonald\'s. 🍔', cat: 'Besties', icon: 'food-hot-dog', color: '#f43f5e' },
      { id: 2, user: 'Xinying', msg: 'avoided a Shopee impulse checkout! +10 Pts. 🛡️', cat: 'Besties', icon: 'shield-star-outline', color: '#22d3ee' },
    ],
    JapanTrip: [
      { id: 1, user: 'Zini', msg: 'saved RM150 for the Osaka Universal Studio! 🎢', cat: 'Japan 2026', icon: 'airplane-takeoff', color: '#22d3ee' },
    ],
    All: [
      { id: 1, user: 'Michelle', msg: 'paid RM5.50 Sin Tax for 2AM McDonald\'s. 🍔', cat: 'Besties', icon: 'food-hot-dog', color: '#f43f5e' },
      { id: 2, user: 'Zini', msg: 'saved RM150 for the Osaka Universal Studio! 🎢', cat: 'Japan 2026', icon: 'airplane-takeoff', color: '#22d3ee' },
      { id: 3, user: 'Xinying', msg: 'avoided a Shopee impulse checkout! +10 Pts. 🛡️', cat: 'Besties', icon: 'shield-star-outline', color: '#22d3ee' },
    ]
  };

  const getJoinCode = () => {
    if (activeSquad === 'Besties') return 'SAMA-BFF-2026';
    if (activeSquad === 'Family') return 'SAMA-FAM-7788';
    if (activeSquad === 'JapanTrip') return 'SAMA-OSAKA-ZN';
    return `SAMA-${activeSquad.toUpperCase()}-26`;
  };

  const handleCreateSquad = () => {
    if (!squadName.trim()) {
      Alert.alert("Error", "Give your squad a name!");
      return;
    }
    const newSquadId = squadName.replace(/\s+/g, '');
    const newSquadName = `${squadName} ✨`;
    const targetAmount = parseFloat(squadGoalAmount) || 1000; 
    
    const newMembers = [{ id: 'z', name: 'Zini (You)', initial: 'Z', color: '#7c3aed' }]; 
    if (inviteMichelle) newMembers.push({ id: 'm', name: 'Michelle', initial: 'M', color: '#22d3ee' });
    if (inviteXinying) newMembers.push({ id: 'x', name: 'Xinying', initial: 'X', color: '#f43f5e' });

    setMembersData((prev: any) => ({ ...prev, [newSquadId]: newMembers }));
    setSquadGoals((prev: any) => ({ ...prev, [newSquadId]: { title: squadName, current: 0, target: targetAmount } }));
    setSquads([...squads, { id: newSquadId, name: newSquadName }]);
    setActiveSquad(newSquadId);
    
    setShowCreateModal(false);
    setSquadName('');
    setSquadGoalAmount('');
    setInviteMichelle(false);
    setInviteXinying(false);
  };

  const handleEditGoal = () => {
    const newTarget = parseFloat(editGoalAmount);
    if (!newTarget || newTarget <= 0) {
      Alert.alert("Error", "Please enter a valid target amount.");
      return;
    }
    setSquadGoals((prev: any) => ({ ...prev, [activeSquad]: { ...prev[activeSquad], target: newTarget } }));
    setShowEditGoalModal(false);
    setEditGoalAmount('');
  };

  const copyToClipboard = (code: string) => {
    Clipboard.setString(code);
    Alert.alert("Code Copied! 📋", `${code} is ready.`);
  };

  // Dynamic Texts for warning modals
  const getWarningTitle = () => {
    if (aiMode === 'Gentle') return "Are you sure about this? 🤔";
    if (aiMode === 'Strict') return "Impulse Spending Alert! 🚨";
    return "DEVIL MODE ACTIVATED 🔥";
  };

  const getWarningBodyText = () => {
    if (aiMode === 'Gentle') return "We noticed a late-night checkout for RM 50.00. Proceeding with this purchase will delay your saving goal by at least 3 days. Is it worth it?";
    if (aiMode === 'Strict') return "Late-night non-essential spending detected. To unlock this RM 50.00 transaction, you must first pay a RM 5.00 'Resilience Tax' into your SamaSave Pocket.";
    return "High-risk impulse buy detected! To proceed, you will pay a 20% Penalty (RM 10.00) into your SamaSave Pocket AND we will broadcast this shame to your active squad. Don't do it.";
  };

  const getProceedButtonText = () => {
    if (aiMode === 'Gentle') return "Proceed Anyway (Delay Goal)";
    if (aiMode === 'Strict') return "Pay RM 5.00 Tax & Proceed";
    return "Accept Penalty & Broadcast Shame";
  };

  const getCancelButtonText = () => {
    if (aiMode === 'Gentle') return "Nevermind, Keep Saving!";
    if (aiMode === 'Strict') return "I'll Save Instead!";
    return "I'm Awake! Cancel Order!";
  };

  const getModeDescription = () => {
    if (aiMode === 'Gentle') return "No penalty, just a friendly reminder. 🍃";
    if (aiMode === 'Strict') return "10% Sin Tax transferred to your vault. 🥊";
    return "20% Penalty + Squad Broadcast! 🔥";
  };

  // ==========================================
  // REAL-TIME DEDUCTION LOGIC
  // ==========================================
  const handleProceedTransaction = () => {
    const itemCost = 50.00; // Simulated transaction amount

    if (aiMode === 'Gentle') {
      // No penalty, only deduct base cost
      setTotalBalance((prev: number) => prev - itemCost);
      Alert.alert("✅ Action Taken", `Transaction approved. RM ${itemCost.toFixed(2)} deducted from your account.`, [{ text: "OK", onPress: () => setShowWarning(false) }]);
    
    } else if (aiMode === 'Strict') {
      // Deduct base cost + RM 5 penalty, store penalty in Vault
      setTotalBalance((prev: number) => prev - (itemCost + 5.00));
      setSamaSaveBalance((prev: number) => prev + 5.00); 
      Alert.alert("💸 Action Taken", `Transaction approved. RM ${(itemCost + 5).toFixed(2)} deducted (Includes RM 5.00 penalty sent to Vault).`, [{ text: "OK", onPress: () => setShowWarning(false) }]);
    
    } else {
      // Deduct base cost + RM 10 penalty, store penalty in Vault
      setTotalBalance((prev: number) => prev - (itemCost + 10.00));
      setSamaSaveBalance((prev: number) => prev + 10.00); 
      Alert.alert("💸 Action Taken", `Transaction approved. RM ${(itemCost + 10).toFixed(2)} deducted. Penalty recorded and broadcasted!`, [{ text: "OK", onPress: () => setShowWarning(false) }]);
    }
  };

  const renderGoalProgress = () => {
    const goal = squadGoals[activeSquad] || { title: 'New Squad Goal', current: 0, target: 1000 };
    const progressPercent = Math.min((goal.current / goal.target) * 100, 100) + '%';
    
    return (
      <View style={styles.goalContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={styles.goalTitle}>{goal.title} 🎯</Text>
          <TouchableOpacity 
            onPress={() => { setEditGoalAmount(goal.target.toString()); setShowEditGoalModal(true); }} 
            style={{flexDirection: 'row', alignItems: 'center'}}
          >
            <Text style={styles.goalAmount}>RM {goal.current} / RM {goal.target}</Text>
            <MaterialCommunityIcons name="pencil-outline" size={14} color="#22d3ee" style={{marginLeft: 5}} />
          </TouchableOpacity>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, {width: progressPercent}]} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a0b2e" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ========================================== */}
        {/*                 HOME Page                  */}
        {/* ========================================== */}
        {activeTab === 'Home' && (
          <View>
            <View style={styles.header}>
              <View>
                <Text style={styles.personalText}>Personal</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.username}>Zini</Text>
                  <Ionicons name="chevron-down" size={16} color="white" style={{ marginLeft: 5 }} />
                </View>
              </View>
              <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.iconButton}><MaterialCommunityIcons name="comment-question-outline" size={24} color="white" /></TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="notifications-outline" size={24} color="white" />
                  <View style={styles.redDot} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Total balance</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                {/* DYNAMIC HOME BALANCE */}
                <Text style={styles.balanceAmount}>RM {totalBalance.toFixed(2)}</Text>
                <Ionicons name="eye-outline" size={20} color="white" style={{ marginLeft: 10 }} />
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionItem}><View style={styles.actionIconBg}><Ionicons name="add" size={24} color="white" /></View><Text style={styles.actionText}>Add money</Text></TouchableOpacity>
              <TouchableOpacity style={styles.actionItem} onPress={() => setShowWarning(true)}><View style={styles.actionIconBg}><MaterialCommunityIcons name="qrcode-scan" size={20} color="white" /></View><Text style={styles.actionText}>Scan QR</Text></TouchableOpacity>
              <TouchableOpacity style={styles.actionItem}><View style={styles.actionIconBg}><Ionicons name="send" size={20} color="white" /></View><Text style={styles.actionText}>Send money</Text></TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your everyday account</Text>
              <MaterialCommunityIcons name="credit-card-outline" size={24} color="#6b7280" />
            </View>

            <View style={styles.cardsContainer}>
              <View style={[styles.card, styles.mainCard]}><Text style={styles.cardLabel}>Main account</Text><Text style={styles.cardAmount}>RM 80.00</Text></View>
              <View style={[styles.card, styles.pocketCard]}>
                <Text style={styles.cardLabelBold}>Pockets</Text><Text style={styles.cardSubText}>Earn 3.55% p.a.</Text>
                <TouchableOpacity style={styles.createButton}><Text style={styles.createButtonText}>Create</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ========================================== */}
        {/*               SamaSave Dashboard           */}
        {/* ========================================== */}
        {activeTab === 'SamaSave' && (
          <View style={styles.dashboardContainer}>
            <View style={styles.dashboardHeader}>
              <Text style={styles.dashboardTitle}>Resilience League 🏆</Text>
              <Text style={styles.dashboardSubtitle}>Who is surviving the impulse?</Text>
            </View>

            {/* DYNAMIC VAULT CARD */}
            <View style={styles.vaultCard}>
              <View style={styles.vaultInfo}>
                <Text style={styles.vaultTitle}>My SamaSave Vault 🏦</Text>
                <Text style={styles.vaultSub}>Resilience tax collected</Text>
              </View>
              {/* DYNAMIC VAULT BALANCE */}
              <Text style={styles.vaultAmount}>RM {samaSaveBalance.toFixed(2)}</Text>
            </View>

            {/* AI Mode Selector */}
            <View style={styles.aiModeContainer}>
              <Text style={styles.sectionTitleSmall}>AI Sensitivity Mode 🤖</Text>
              <View style={styles.modeToggleRow}>
                {['Gentle', 'Strict', 'Devil'].map((mode) => (
                  <TouchableOpacity key={mode} onPress={() => setAiMode(mode)} style={[styles.modeButton, aiMode === mode && styles.modeButtonActive]}>
                    <Text style={[styles.modeButtonText, aiMode === mode && styles.modeButtonTextActive]}>{mode}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.modeDescription}>{getModeDescription()}</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              <TouchableOpacity onPress={() => setActiveSquad('All')} style={[styles.squadBadge, activeSquad === 'All' && styles.squadBadgeActive]}>
                <MaterialCommunityIcons name="view-grid-outline" size={16} color={activeSquad === 'All' ? "white" : "#9ca3af"} style={{ marginRight: 4 }} />
                <Text style={[styles.squadText, activeSquad === 'All' && styles.squadTextActive]}>All</Text>
              </TouchableOpacity>
              {squads.map((squad) => (
                <TouchableOpacity key={squad.id} onPress={() => setActiveSquad(squad.id)} style={[styles.squadBadge, activeSquad === squad.id && styles.squadBadgeActive]}>
                  <Text style={[styles.squadText, activeSquad === squad.id && styles.squadTextActive]}>{squad.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowCreateModal(true)} style={styles.squadBadgeDashed}><Ionicons name="add" size={16} color="#9ca3af" /><Text style={styles.squadText}>New</Text></TouchableOpacity>
            </ScrollView>
            
            <View style={styles.leaderboardBox}>
              {activeSquad === 'All' ? (
                <View style={styles.gridContainer}>
                  <Text style={styles.gridHeader}>Squad Categories 📁</Text>
                  {squads.map((squad) => (
                    <TouchableOpacity key={squad.id} style={styles.categoryCard} onPress={() => setActiveSquad(squad.id)}>
                      <Text style={styles.categoryCardTitle}>{squad.name}</Text>
                      <Text style={styles.categoryCardLink}>View Board &gt;</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={[styles.categoryCard, styles.categoryCardDashed]} onPress={() => setShowCreateModal(true)}>
                    <Ionicons name="add" size={24} color="#6b7280" /><Text style={styles.categoryCardPlaceholder}>Create New</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={styles.squadInfoRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                      <Text style={styles.squadBoardTitle}>Members</Text>
                      <TouchableOpacity onPress={() => setShowMembersModal(true)} style={{ marginLeft: 10 }}>
                        <Text style={styles.seeAllText}>See All &gt;</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.avatarRow}>
                      {(membersData[activeSquad] || [{ id: 'z', initial: 'Z', color: '#7c3aed' }]).map((m: any, index: number) => (
                        <View key={m.id} style={[styles.avatar, { backgroundColor: m.color, marginLeft: index === 0 ? 0 : -10 }]}>
                          <Text style={styles.avatarText}>{m.initial}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.divider} />

                  {/* Render Shared Goal Progress Bar */}
                  {renderGoalProgress()}

                  {activeSquad === 'Besties' ? (
                    <>
                      {renderRankRow("🥇", "Zini", "98", "Safe 🛡️", "+0.5% Interest Unlocked! 🚀")}
                      <View style={styles.divider} />
                      {renderRankRow("🥈", "Xinying", "95", "Safe 🛡️")}
                      <View style={styles.divider} />
                      {renderRankRow("🥉", "Michelle", "85", "Warning ⚠️")}
                    </>
                  ) : activeSquad === 'JapanTrip' ? (
                    <View style={styles.rankRow}>
                      <Text style={styles.rankMedal}>🥇</Text>
                      <View style={styles.rankInfo}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.rankName}>Zini</Text>
                          <View style={styles.bonusBadge}><Text style={styles.bonusText}>+0.5% Interest Unlocked! 🚀</Text></View>
                        </View>
                        <Text style={styles.rankStatusSafe}>Score: 100 | Ready for Sushi 🍣</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: '#9ca3af', fontSize: 14 }}>Welcome to your new squad!</Text>
                      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Rank #1 👑</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Savage Activity Feed 👀</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(true)}><Text style={styles.seeAllText}>See All &gt;</Text></TouchableOpacity>
            </View>
            
            <View style={styles.feedBox}>
              {(activityData[activeSquad] || []).slice(0, 2).map((item: any) => (
                <View key={item.id} style={styles.feedItem}>
                  <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.feedText}><Text style={styles.feedName}>{item.user}</Text> {item.msg}</Text>
                    <Text style={styles.feedCategoryLabel}>in {item.cat}</Text>
                  </View>
                </View>
              ))}
              {(!activityData[activeSquad] || activityData[activeSquad].length === 0) && (
                 <View style={{ padding: 15, alignItems: 'center' }}>
                    <MaterialCommunityIcons name="sleep" size={30} color="#6b7280" />
                    <Text style={{ color: '#9ca3af', fontSize: 13, marginTop: 8 }}>Quiet here... No activity yet.</Text>
                 </View>
              )}
            </View>

            {activeSquad === 'All' ? (
              <TouchableOpacity style={styles.createMainButton} onPress={() => setShowCreateModal(true)}>
                <Ionicons name="add-circle" size={22} color="white" style={{marginRight: 8}}/>
                <Text style={styles.inviteButtonText}>Create New Category</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.inviteButton} onPress={() => setShowInviteModal(true)}>
                <Ionicons name="person-add" size={18} color="white" style={{marginRight: 8}}/>
                <Text style={styles.inviteButtonText}>Invite Friends</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Impulse Modal */}
      <Modal visible={showWarning} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.warningBox, aiMode === 'Devil' && { borderColor: '#f43f5e', borderWidth: 3 }]}>
            <MaterialCommunityIcons 
              name={aiMode === 'Devil' ? "fire" : (aiMode === 'Gentle' ? "thought-bubble-outline" : "alert-octagon")} 
              size={60} 
              color={aiMode === 'Gentle' ? "#22d3ee" : "#f43f5e"} 
            />
            <Text style={styles.warningTitle}>{getWarningTitle()}</Text>
            <Text style={styles.warningSubText}>Current Sensitivity: {aiMode}</Text>
            <Text style={[styles.warningText, {fontWeight: 'bold', color: 'white', fontSize: 15}]}>{getWarningBodyText()}</Text>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.payPenaltyButton} onPress={handleProceedTransaction}>
              <Text style={styles.payPenaltyText}>{getProceedButtonText()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelTransactionButton} onPress={() => { Alert.alert("🛡️ Victory", "Impulse stopped! No money deducted.", [{ text: "Done", onPress: () => setShowWarning(false) }]); }}>
              <Text style={styles.cancelTransactionText}>{getCancelButtonText()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Squad Creation Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.createBox}>
                <Text style={styles.createTitle}>Create New Category 🚀</Text>
                
                <TextInput style={styles.inputField} placeholder="e.g. Graduation Trip" placeholderTextColor="#6b7280" value={squadName} onChangeText={setSquadName} underlineColorAndroid="transparent" />
                <TextInput style={styles.inputField} placeholder="Target Goal Amount (RM)" placeholderTextColor="#6b7280" value={squadGoalAmount} onChangeText={setSquadGoalAmount} keyboardType="numeric" underlineColorAndroid="transparent" />

                <View style={styles.inviteSection}>
                  <Text style={styles.inviteTitle}>Initial Members:</Text>
                  {renderInviteRow("Michelle", inviteMichelle, setInviteMichelle)}
                  {renderInviteRow("Xinying", inviteXinying, setInviteXinying)}
                </View>
                
                <TouchableOpacity style={styles.createSubmitButton} onPress={handleCreateSquad}><Text style={styles.createSubmitText}>Start Squad</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}><Text style={styles.cancelLinkText}>Cancel</Text></TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Target Goal Modal */}
      <Modal visible={showEditGoalModal} animationType="fade" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.createBox}>
                <Text style={styles.createTitle}>Update Goal 🎯</Text>
                <Text style={styles.inviteTitle}>New target amount for {squadGoals[activeSquad]?.title}:</Text>
                <TextInput style={styles.inputField} placeholder="Enter new target (RM)" placeholderTextColor="#6b7280" value={editGoalAmount} onChangeText={setEditGoalAmount} keyboardType="numeric" />
                <TouchableOpacity style={styles.createSubmitButton} onPress={handleEditGoal}><Text style={styles.createSubmitText}>Save Changes</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEditGoalModal(false)}><Text style={styles.cancelLinkText}>Cancel</Text></TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Join Code Modal */}
      <Modal visible={showInviteModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.inviteCodeBox}>
            <MaterialCommunityIcons name="account-multiple-plus" size={50} color="#7c3aed" />
            <Text style={styles.inviteCodeTitle}>Invite Teammates 🤝</Text>
            <Text style={styles.inviteCodeSub}>Share this code to save together in {activeSquad}!</Text>
            <TouchableOpacity style={styles.codeContainer} onPress={() => copyToClipboard(getJoinCode())}>
              <Text style={styles.codeText} numberOfLines={1}>{getJoinCode()}</Text>
              <Ionicons name="copy-outline" size={18} color="#7c3aed" />
            </TouchableOpacity>
            <Text style={styles.expiryText}>Code expires in 24 hours</Text>
            <TouchableOpacity style={styles.closeInviteButton} onPress={() => setShowInviteModal(false)}><Text style={styles.closeInviteText}>Got it!</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Members Modal */}
      <Modal visible={showMembersModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.historyBox}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Squad Members 👥</Text>
              <TouchableOpacity onPress={() => setShowMembersModal(false)}><Ionicons name="close-circle" size={28} color="#9ca3af" /></TouchableOpacity>
            </View>
            <ScrollView>
              {(membersData[activeSquad] || [{ id: 'z', name: 'Zini (You)', initial: 'Z', color: '#7c3aed' }]).map((m: any) => (
                <View key={m.id} style={styles.memberItem}>
                  <View style={[styles.avatarLarge, { backgroundColor: m.color }]}>
                    <Text style={styles.avatarTextLarge}>{m.initial}</Text>
                  </View>
                  <View style={{ marginLeft: 15, flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.memberName}>{m.name}</Text>
                    <Text style={styles.memberStatus}>Active Member</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeHistoryButton} onPress={() => setShowMembersModal(false)}><Text style={styles.closeHistoryText}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* History Modal */}
      <Modal visible={showHistoryModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.historyBox}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Activity History 📜</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(false)}><Ionicons name="close-circle" size={28} color="#9ca3af" /></TouchableOpacity>
            </View>
            <ScrollView>
              {(activityData[activeSquad] || activityData.All).map((item: any) => (
                <View key={item.id} style={styles.historyItem}>
                  <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
                  <View style={{ marginLeft: 15, flex: 1 }}>
                    <Text style={styles.feedText}><Text style={styles.feedName}>{item.user}</Text> {item.msg}</Text>
                    <Text style={styles.feedCategoryLabel}>in {item.cat} • 2h ago</Text>
                  </View>
                </View>
              ))}
              {(!activityData[activeSquad] || activityData[activeSquad].length === 0) && (
                 <View style={{ padding: 15, alignItems: 'center' }}>
                    <MaterialCommunityIcons name="sleep" size={30} color="#6b7280" />
                    <Text style={{ color: '#9ca3af', fontSize: 13, marginTop: 8 }}>Quiet here... No activity yet.</Text>
                 </View>
              )}
            </ScrollView>
            <TouchableOpacity style={styles.closeHistoryButton} onPress={() => setShowHistoryModal(false)}><Text style={styles.closeHistoryText}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Nav Bar */}
      <View style={styles.bottomNav}>
        {renderNavItem("home", "Home", activeTab === 'Home', () => setActiveTab('Home'))}
        {renderNavItem("gift-outline", "Rewards", false, () => {})}
        <TouchableOpacity style={styles.centerNavContainer} onPress={() => setActiveTab('SamaSave')}>
          <View style={styles.centerNavInner}><MaterialCommunityIcons name="lightning-bolt" size={28} color="white" /></View>
          <Text style={styles.centerNavText}>SamaSave</Text>
        </TouchableOpacity>
        {renderNavItem("grid-outline", "Discover", false, () => {})}
        {renderNavItem("person-outline", "Me", false, () => {})}
      </View>
    </SafeAreaView>
  );
}

// Sub-components
const renderRankRow = (medal: any, name: any, score: any, status: any, bonusText: any = null) => (
  <View style={styles.rankRow}>
    <Text style={styles.rankMedal}>{medal}</Text>
    <View style={styles.rankInfo}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.rankName}>{name}</Text>
        {bonusText && (
          <View style={styles.bonusBadge}>
            <Text style={styles.bonusText}>{bonusText}</Text>
          </View>
        )}
      </View>
      <Text style={styles.rankStatusSafe}>Score: {score} | {status}</Text>
    </View>
  </View>
);

const renderInviteRow = (name: any, val: any, setVal: any) => (
  <TouchableOpacity style={styles.inviteRow} onPress={() => setVal(!val)}>
    <MaterialCommunityIcons name={val ? "checkbox-marked" : "checkbox-blank-outline"} size={24} color={val ? "#7c3aed" : "#6b7280"} />
    <Text style={styles.inviteName}>{name}</Text>
  </TouchableOpacity>
);

const renderNavItem = (icon: any, label: any, isActive: any, onPress: any) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color={isActive ? "white" : "#6b7280"} />
    <Text style={isActive ? styles.navTextActive : styles.navText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#11081f' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  personalText: { color: '#9ca3af', fontSize: 12 },
  username: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  redDot: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, backgroundColor: 'red', borderRadius: 4 },
  balanceSection: { marginTop: 20 },
  balanceLabel: { color: '#e5e7eb', fontSize: 14 },
  balanceAmount: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#1f1b2e', borderRadius: 20, paddingVertical: 20, marginTop: 25 },
  actionItem: { alignItems: 'center' },
  actionIconBg: { backgroundColor: '#7c3aed', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionText: { color: 'white', fontSize: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 15 },
  sectionTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cardsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  card: { backgroundColor: '#1f1b2e', borderRadius: 16, padding: 15, width: '48%', height: 160 },
  mainCard: { justifyContent: 'space-between' },
  pocketCard: { justifyContent: 'flex-start' },
  cardLabel: { color: '#9ca3af', fontSize: 12 },
  cardLabelBold: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cardAmount: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 5 },
  cardSubText: { color: '#e5e7eb', fontSize: 12, marginTop: 5, marginBottom: 10 },
  createButton: { borderColor: 'white', borderWidth: 1, borderRadius: 20, paddingVertical: 6, alignItems: 'center', marginTop: 'auto' },
  createButtonText: { color: 'white', fontSize: 12 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#11081f', paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#2d1b4e' },
  centerNavContainer: { alignItems: 'center', marginTop: -25 },
  centerNavInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#f43f5e', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#11081f' },
  centerNavText: { color: '#f43f5e', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  navItem: { alignItems: 'center' },
  navText: { color: '#6b7280', fontSize: 10, marginTop: 4 },
  navTextActive: { color: 'white', fontSize: 10, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  warningBox: { backgroundColor: '#1f1b2e', width: '100%', borderRadius: 20, padding: 25, alignItems: 'center' },
  warningTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 15, textAlign: 'center' },
  warningSubText: { color: '#9ca3af', fontSize: 13, textAlign: 'center', marginTop: 5 },
  warningText: { color: '#9ca3af', fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 22 },
  divider: { width: '100%', height: 1, backgroundColor: '#2d1b4e', marginVertical: 15 },
  payPenaltyButton: { backgroundColor: '#11081f', width: '100%', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  payPenaltyText: { color: '#f43f5e', fontWeight: 'bold' },
  cancelTransactionButton: { backgroundColor: '#f43f5e', width: '100%', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  cancelTransactionText: { color: 'white', fontWeight: 'bold' },
  dashboardContainer: { marginTop: 10 },
  dashboardTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  dashboardSubtitle: { color: '#9ca3af', fontSize: 14 },
  dashboardHeader: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  
  vaultCard: { backgroundColor: '#2d1b4e', borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#7c3aed', marginBottom: 15 },
  vaultInfo: { flex: 1 },
  vaultTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  vaultSub: { color: '#22d3ee', fontSize: 12, marginTop: 4 },
  vaultAmount: { color: 'white', fontSize: 24, fontWeight: 'bold' },

  aiModeContainer: { backgroundColor: '#1f1b2e', padding: 20, borderRadius: 20, marginVertical: 20, borderWidth: 1, borderColor: '#2d1b4e' },
  modeToggleRow: { flexDirection: 'row', backgroundColor: '#11081f', borderRadius: 12, padding: 5 },
  modeButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  modeButtonActive: { backgroundColor: '#7c3aed' },
  modeButtonText: { color: '#6b7280', fontSize: 13, fontWeight: 'bold' },
  modeButtonTextActive: { color: 'white' },
  modeDescription: { color: '#9ca3af', fontSize: 12, marginTop: 10, textAlign: 'center' },
  sectionTitleSmall: { color: '#9ca3af', fontSize: 12, fontWeight: 'bold', marginBottom: 10 },
  leaderboardBox: { backgroundColor: '#1f1b2e', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#2d1b4e' },
  
  goalContainer: { backgroundColor: '#11081f', borderRadius: 15, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: '#2d1b4e' },
  goalTitle: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  goalAmount: { color: '#22d3ee', fontSize: 12, fontWeight: 'bold' },
  progressBarBg: { height: 8, backgroundColor: '#2d1b4e', borderRadius: 4, marginTop: 12 },
  progressBarFill: { height: 8, backgroundColor: '#22d3ee', borderRadius: 4 },
  
  squadInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  squadBoardTitle: { color: '#9ca3af', fontSize: 14, fontWeight: 'bold' },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#1f1b2e' },
  avatarText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: { backgroundColor: '#2d1b4e', width: '48%', height: 100, borderRadius: 15, padding: 15, marginBottom: 15, justifyContent: 'space-between' },
  categoryCardDashed: { backgroundColor: 'transparent', borderStyle: 'dashed', borderWidth: 1, borderColor: '#6b7280', alignItems: 'center', justifyContent: 'center' },
  categoryCardTitle: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  categoryCardLink: { color: '#7c3aed', fontSize: 12 },
  categoryCardPlaceholder: { color: '#6b7280', fontSize: 12, marginTop: 5 },
  gridHeader: { color: 'white', width: '100%', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  rankRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  rankMedal: { fontSize: 24, marginRight: 15 },
  rankName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  rankStatusSafe: { color: '#22d3ee', fontSize: 11, marginTop: 4 },
  rankInfo: { flex: 1 },
  
  bonusBadge: { backgroundColor: 'rgba(34, 211, 238, 0.15)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, marginLeft: 8, borderWidth: 1, borderColor: '#22d3ee' },
  bonusText: { color: '#22d3ee', fontSize: 9, fontWeight: 'bold' },

  feedBox: { backgroundColor: '#1f1b2e', borderRadius: 16, padding: 15, borderWidth: 1, borderColor: '#2d1b4e' },
  feedItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  feedText: { color: '#e5e7eb', fontSize: 13, flex: 1, lineHeight: 18 },
  feedName: { fontWeight: 'bold', color: 'white' },
  feedCategoryLabel: { color: '#7c3aed', fontSize: 10, fontWeight: 'bold', marginTop: 3 },
  inviteButton: { flexDirection: 'row', backgroundColor: '#7c3aed', paddingVertical: 15, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  createMainButton: { flexDirection: 'row', backgroundColor: '#22d3ee', paddingVertical: 15, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  inviteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  squadBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1f1b2e', marginRight: 10, borderWidth: 1, borderColor: '#2d1b4e' },
  squadBadgeActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  squadText: { color: '#9ca3af', fontSize: 14, fontWeight: 'bold' },
  squadTextActive: { color: 'white' },
  squadBadgeDashed: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'transparent', marginRight: 10, borderWidth: 1, borderColor: '#6b7280', borderStyle: 'dashed' },
  inviteCodeBox: { backgroundColor: '#1f1b2e', width: '90%', borderRadius: 30, padding: 25, alignItems: 'center', borderWidth: 2, borderColor: '#7c3aed' },
  inviteCodeTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  inviteCodeSub: { color: '#9ca3af', fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  codeContainer: { backgroundColor: '#11081f', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 15, borderRadius: 15, marginTop: 25, borderWidth: 1, borderColor: '#7c3aed', width: '100%', justifyContent: 'center' },
  codeText: { color: '#7c3aed', fontSize: 16, fontWeight: 'bold', letterSpacing: 1.5, marginRight: 10 },
  expiryText: { color: '#6b7280', fontSize: 12, marginTop: 15 },
  closeInviteButton: { backgroundColor: '#7c3aed', width: '100%', paddingVertical: 15, borderRadius: 15, alignItems: 'center', marginTop: 25 },
  closeInviteText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  historyBox: { backgroundColor: '#1f1b2e', width: '100%', height: '80%', borderRadius: 30, padding: 20, borderWidth: 1, borderColor: '#7c3aed' },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  historyTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  historyItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#2d1b4e' },
  closeHistoryButton: { backgroundColor: '#2d1b4e', width: '100%', paddingVertical: 15, borderRadius: 15, alignItems: 'center', marginTop: 'auto' },
  closeHistoryText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  seeAllText: { color: '#7c3aed', fontSize: 12, fontWeight: 'bold' },
  createBox: { backgroundColor: '#1f1b2e', width: '100%', borderRadius: 20, padding: 25, borderWidth: 1, borderColor: '#7c3aed' },
  createTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  inputField: { backgroundColor: '#11081f', color: 'white', borderRadius: 10, padding: 15, fontSize: 16, borderWidth: 1, borderColor: '#2d1b4e', marginBottom: 20 },
  inviteSection: { marginBottom: 25 },
  inviteTitle: { color: '#e5e7eb', fontSize: 14, marginBottom: 15, fontWeight: 'bold' },
  inviteRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  inviteName: { color: 'white', fontSize: 16, marginLeft: 10 },
  createSubmitButton: { backgroundColor: '#7c3aed', width: '100%', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  createSubmitText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cancelLinkText: { color: '#9ca3af', textAlign: 'center', fontWeight: 'bold' },
  
  memberItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#2d1b4e' },
  avatarLarge: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  avatarTextLarge: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  memberName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  memberStatus: { color: '#22d3ee', fontSize: 12, marginTop: 2 }
});