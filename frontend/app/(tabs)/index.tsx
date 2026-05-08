import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Alert, Platform, TouchableWithoutFeedback, Keyboard, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SamaSaveModals } from '../../components/SamaSaveModals';

export default function App() {
  // Modal visibility states
  const [showWarning, setShowWarning] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false); 
  const [showDepositModal, setShowDepositModal] = useState(false); 
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false); 
  const [showBindPartnerModal, setShowBindPartnerModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showGXBankModal, setShowGXBankModal] = useState(false);
  const [completedAmount, setCompletedAmount] = useState(0);
  
  // Tab and squad selection states
  const [activeTab, setActiveTab] = useState('Home');
  const [activeSquad, setActiveSquad] = useState('All');
  
  // ==========================================
  // CORE FINANCIAL STATES
  // ==========================================
  const [totalBalance, setTotalBalance] = useState(1500.00); 
  const [partnerPenaltyBalance, setPartnerPenaltyBalance] = useState(0); 
  const [boundPartner, setBoundPartner] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState('Strict'); 
  
  // Initial squad list
  const [squads, setSquads] = useState([
    { id: 'KLTripFund', name: 'KL Trip Fund 🌴', isCompleted: false },
    { id: 'NewTVFund', name: 'New TV Fund 📺', isCompleted: false },
    { id: 'OsakaTrip', name: 'Osaka Trip 🍣', isCompleted: true }
  ]);
  
  // Form states
  const [squadName, setSquadName] = useState('');
  const [squadGoalAmount, setSquadGoalAmount] = useState(''); 
  const [squadUsableStartDate, setSquadUsableStartDate] = useState('');
  const [squadUsableEndDate, setSquadUsableEndDate] = useState('');
  const [inviteMichelle, setInviteMichelle] = useState(false);
  const [inviteXinying, setInviteXinying] = useState(false); 
  const [editGoalAmount, setEditGoalAmount] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState(''); 
  const [depositAmount, setDepositAmount] = useState('');
  const [depositFreq, setDepositFreq] = useState('One-time'); 
  const [gxPaymentAmount, setGxPaymentAmount] = useState('');
  const [linkedGXPocket, setLinkedGXPocket] = useState<string | null>(null);

  // ==========================================
  // DYNAMIC MEMBERS & LEADERBOARD (SCENARIO B)
  // 'saved' is for overall progress, 'weekly' is for leaderboard ranking
  // ==========================================
  const [membersData, setMembersData] = useState<any>({
    KLTripFund: [
      { id: 'z', name: 'Zini(You)', initial: 'Z', color: '#7c3aed', saved: 1260, weekly: 40, target: 2000, status: 'Safe 🛡️' },
      { id: 'x', name: 'Xinying', initial: 'X', color: '#f43f5e', saved: 1400, weekly: 120, target: 2000, status: 'Safe 🛡️' },
      { id: 'm', name: 'Michelle', initial: 'M', color: '#22d3ee', saved: 900, weekly: 15, target: 2000, status: 'Warning ⚠️' }
    ],
    NewTVFund: [
      { id: 'z', name: 'Zini', initial: 'Z', color: '#7c3aed', saved: 800, weekly: 100, target: 3000, status: 'On Track 🎯' }
    ],
    OsakaTrip: [
      { id: 'z', name: 'Zini', initial: 'Z', color: '#7c3aed', saved: 4500, weekly: 500, target: 8000, status: 'Ready for Sushi 🍣' }
    ]
  });

  // Dynamic shared goals 
  const [squadGoals, setSquadGoals] = useState<any>({
    KLTripFund: { title: 'KL Trip Fund', target: 2000, startDate: '2026-05-01', endDate: '2026-05-31' },
    NewTVFund: { title: 'New TV Fund', target: 3000, startDate: '2026-01-01', endDate: '2026-04-30' },
    OsakaTrip: { title: 'Osaka Trip', target: 8000, startDate: '2026-06-01', endDate: '2026-08-31' }
  });

  // Activity feed data
  const [activities, setActivities] = useState<any>({
    KLTripFund: [
      { id: 1, user: 'Michelle', msg: 'paid RM5.50 Sin Tax for 2AM McDonald\'s. 🍔', cat: 'KL Trip Fund', icon: 'food-hot-dog', color: '#f43f5e' },
      { id: 2, user: 'Xinying', msg: 'avoided a Shopee impulse checkout! +10 Pts. 🛡️', cat: 'KL Trip Fund', icon: 'shield-star-outline', color: '#22d3ee' },
    ],
    OsakaTrip: [
      { id: 1, user: 'Zini', msg: 'saved RM150 for the Osaka Universal Studio! 🎢', cat: 'Osaka Trip', icon: 'airplane-takeoff', color: '#22d3ee' },
    ],
    All: [
      { id: 1, user: 'Michelle', msg: 'paid RM5.50 Sin Tax for 2AM McDonald\'s. 🍔', cat: 'KL Trip Fund', icon: 'food-hot-dog', color: '#f43f5e' },
      { id: 2, user: 'Zini', msg: 'saved RM150 for the Osaka Universal Studio! 🎢', cat: 'Osaka Trip', icon: 'airplane-takeoff', color: '#22d3ee' },
      { id: 3, user: 'Xinying', msg: 'avoided a Shopee impulse checkout! +10 Pts. 🛡️', cat: 'KL Trip Fund', icon: 'shield-star-outline', color: '#22d3ee' },
    ]
  });

  // Generates the join code based on the active squad selection.
  const getJoinCode = () => {
    if (activeSquad === 'KLTripFund') return 'SAMA-KL-2026';
    if (activeSquad === 'NewTVFund') return 'SAMA-TV-7788';
    if (activeSquad === 'OsakaTrip') return 'SAMA-OSAKA-ZN';
    return `SAMA-${activeSquad.toUpperCase()}-26`;
  };

  // Creates a new squad, adds mock members, and updates the state.
  const handleCreateSquad = () => {
    if (!squadName.trim()) {
      Alert.alert("Error", "Give your squad a name!");
      return;
    }
    const newSquadId = squadName.replace(/\s+/g, '');
    const newSquadName = `${squadName}`;
    const targetAmount = parseFloat(squadGoalAmount) || 1000; 
    
    const newMembers = [{ id: 'z', name: 'Zini', initial: 'Z', color: '#7c3aed', saved: targetAmount, weekly: 0, target: targetAmount, status: 'Leader 👑' }]; 
    if (inviteMichelle) newMembers.push({ id: 'm', name: 'Michelle', initial: 'M', color: '#22d3ee', saved: targetAmount * 0.8, weekly: 0, target: targetAmount, status: 'Just joined 🐣' });
    if (inviteXinying) newMembers.push({ id: 'x', name: 'Xinying', initial: 'X', color: '#f43f5e', saved: targetAmount * 0.9, weekly: 0, target: targetAmount, status: 'Catching up 🏃' });

    setMembersData((prev: any) => ({ ...prev, [newSquadId]: newMembers }));
    setSquadGoals((prev: any) => ({ ...prev, [newSquadId]: { title: squadName, target: targetAmount, startDate: squadUsableStartDate, endDate: squadUsableEndDate } }));
    setSquads([...squads, { id: newSquadId, name: newSquadName, isCompleted: false }]);
    setActiveSquad(newSquadId);
    
    setShowCreateModal(false);
    setSquadName('');
    setSquadGoalAmount('');
    setSquadUsableStartDate('');
    setSquadUsableEndDate('');
    setInviteMichelle(false);
    setInviteXinying(false);
  };

  // Allows a user to join an existing squad using a secret code.
  const handleJoinSquad = () => {
    const code = joinCodeInput.trim();
    if (!code) {
      Alert.alert("Error", "Please enter a valid join code!");
      return;
    }

    const parts = code.split('-');
    let dynamicName = "New Squad";
    
    if (parts.length >= 2) {
      const rawName = parts[1];
      dynamicName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
    } else {
      dynamicName = code;
    }

    const newSquadId = 'JoinedSquad' + Date.now(); 
    const newSquadName = `${dynamicName} Fund`; 
    const targetAmount = 15000; 

    const newMembers = [
      { id: 'x', name: 'Xinying', initial: 'X', color: '#f43f5e', saved: 12000, weekly: 800, target: targetAmount, status: 'Safe 🛡️' }, 
      { id: 'z', name: 'Zini', initial: 'Z', color: '#7c3aed', saved: 14000, weekly: 200, target: targetAmount, status: 'Catching up 🏃' }, 
      { id: 'm', name: 'Michelle', initial: 'M', color: '#22d3ee', saved: 9000, weekly: 50, target: targetAmount, status: 'Warning ⚠️' } 
    ];

    setMembersData((prev: any) => ({ ...prev, [newSquadId]: newMembers }));
    setSquadGoals((prev: any) => ({ ...prev, [newSquadId]: { title: `${dynamicName} trip Fund`, target: targetAmount } }));
    setSquads((prev: any) => [{ id: newSquadId, name: newSquadName }, ...prev]);
    setActiveSquad(newSquadId);
    
    setShowJoinModal(false);
    setJoinCodeInput('');
    Alert.alert("Success!", `You have successfully joined ${newSquadName}!`);
  };

  // Modifies the target goal amount for the currently active squad.
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

  // Deducts money from main balance and adds it to the user's squad progress.
  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      Alert.alert("Error", "Please enter a valid saving amount.");
      return;
    }
    if (amount > totalBalance) {
      Alert.alert("Failed", "Insufficient balance in your Main Account.");
      return;
    }

    setTotalBalance(prev => prev - amount);

    setMembersData((prev: any) => {
      const squadMembers = prev[activeSquad] || [];
      const updatedMembers = squadMembers.map((m: any) => {
        if (m.id === 'z') {
          return { ...m, saved: m.saved + amount, weekly: (m.weekly || 0) + amount };
        }
        return m;
      });
      return { ...prev, [activeSquad]: updatedMembers };
    });

    const freqText = depositFreq === 'One-time' ? '' : ` (Auto: ${depositFreq})`;
    const newActivity = {
      id: Date.now(),
      user: 'Zini',
      msg: `deposited RM ${amount.toFixed(2)}${freqText} into the pocket! 💰`,
      cat: squadGoals[activeSquad]?.title || 'Squad Goal',
      icon: 'cash-plus',
      color: '#10b981' 
    };

    setActivities((prev: any) => ({
      ...prev,
      [activeSquad]: [newActivity, ...(prev[activeSquad] || [])],
      All: [newActivity, ...(prev.All || [])]
    }));

    setShowDepositModal(false);
    setDepositAmount('');
    setDepositFreq('One-time');
    Alert.alert("Saved!", `RM ${amount.toFixed(2)} has been moved to your pocket.`);
  };

  // Simulates the end date arriving, closing the pocket and transferring remaining back.
  const handleSimulateCompletion = () => {
    const goal = squadGoals[activeSquad] || { title: 'New Squad Goal', target: 1000 };
    const ziniData = (membersData[activeSquad] || []).find((m: any) => m.id === 'z') || { saved: 0 };
    const currentSaved = ziniData.saved;
    
    setSquads((prev: any) => prev.map((s: any) => s.id === activeSquad ? { ...s, isCompleted: true } : s));
    
    if (currentSaved > 0) {
      setCompletedAmount(currentSaved);
      setShowCompletionModal(true);
      setTotalBalance((prev: number) => prev + currentSaved);
    } else {
      Alert.alert("Pocket Completed", "Pocket closed. No remaining balance to transfer.");
    }
  };

  // Copies the squad join code to the device clipboard.
  const copyToClipboard = (code: string) => {
    Clipboard.setString(code);
    Alert.alert("Code Copied!", `${code} is ready.`);
  };

  // Returns the dynamic title for the impulse warning modal based on AI mode.
  const getWarningTitle = () => {
    if (aiMode === 'Gentle') return "Are you sure about this? 🤔";
    if (aiMode === 'Strict') return "Impulse Spending Alert! 🚨";
    return "DEVIL MODE ACTIVATED 🔥";
  };

  // Returns the dynamic explanation text for the impulse warning based on AI mode.
  const getWarningBodyText = () => {
    if (aiMode === 'Gentle') return "We noticed a late-night checkout for RM 50.00. Proceeding with this purchase will delay your saving goal by at least 3 days. Is it worth it?";
    if (aiMode === 'Strict') return "Late-night non-essential spending detected. To unlock this RM 50.00 transaction, you must pay a 3% penalty (RM 1.50) to your Accountability Partner.";
    return "High-risk impulse buy detected! To proceed, you will pay an 8% Penalty (RM 4.00) to your Accountability Partner AND we will broadcast this shame to your pocket members. Don't do it.";
  };

  // Returns the text for the button that forces the transaction to go through.
  const getProceedButtonText = () => {
    if (aiMode === 'Gentle') return "Proceed Anyway (Delay Goal)";
    if (aiMode === 'Strict') return "Pay RM 1.50 Penalty & Proceed";
    return "Pay RM 4.00 Penalty & Broadcast Shame";
  };

  // Returns the text for the button that cancels the impulse transaction.
  const getCancelButtonText = () => {
    if (aiMode === 'Gentle') return "Nevermind, Keep Saving!";
    if (aiMode === 'Strict') return "I'll Save Instead!";
    return "I'm Awake! Cancel Order!";
  };

  // Returns a small subtext describing what the selected AI mode does.
  const getModeDescription = () => {
    if (aiMode === 'Gentle') return "No penalty, just a friendly reminder. 🍃";
    if (aiMode === 'Strict') return "3% Penalty transferred to your partner. 🥊";
    return "8% Penalty + Squad Broadcast! 🔥";
  };

  // Executes the impulse transaction, applying the appropriate penalty and transferring it to the partner.
  const handleProceedTransaction = () => {
    if ((aiMode === 'Strict' || aiMode === 'Devil') && !boundPartner) {
      Alert.alert("Partner Required", "You must link an Accountability Partner to proceed with impulse purchases in this mode.");
      setShowWarning(false);
      setShowBindPartnerModal(true);
      return;
    }

    const itemCost = 50.00; 

    if (aiMode === 'Gentle') {
      setTotalBalance((prev: number) => prev - itemCost);
      Alert.alert("Action Taken", `Transaction approved. RM ${itemCost.toFixed(2)} deducted from your account.`, [{ text: "OK", onPress: () => setShowWarning(false) }]);
    
    } else if (aiMode === 'Strict') {
      const penalty = itemCost * 0.03; // 3% penalty = 1.50
      setTotalBalance((prev: number) => prev - (itemCost + penalty));
      setPartnerPenaltyBalance((prev: number) => prev + penalty); 

      const penaltyActivity = {
        id: Date.now(),
        user: 'Zini',
        msg: `couldn't resist temptation! Paid RM ${penalty.toFixed(2)} penalty to ${boundPartner} 🥊`,
        cat: 'Global Feed',
        icon: 'alert-octagon',
        color: '#f59e0b' 
      };

      setActivities((prev: any) => ({
        ...prev,
        All: [penaltyActivity, ...(prev.All || [])]
      }));

      Alert.alert("Action Taken", `Transaction approved. RM ${(itemCost + penalty).toFixed(2)} deducted. RM ${penalty.toFixed(2)} sent to ${boundPartner} and broadcasted to main feed!`, [{ text: "OK", onPress: () => setShowWarning(false) }]);
    
    } else {
      const penalty = itemCost * 0.08; // 8% penalty = 4.00
      setTotalBalance((prev: number) => prev - (itemCost + penalty));
      setPartnerPenaltyBalance((prev: number) => prev + penalty); 

      const penaltyActivity = {
        id: Date.now(),
        user: 'Zini',
        msg: `succumbed to a high-risk impulse buy! Paid RM ${penalty.toFixed(2)} penalty to ${boundPartner} 🔥`,
        cat: 'Shame Board',
        icon: 'fire',
        color: '#f43f5e' 
      };

      setActivities((prev: any) => ({
        ...prev,
        All: [penaltyActivity, ...(prev.All || [])]
      }));

      Alert.alert("Action Taken", `Transaction approved. RM ${(itemCost + penalty).toFixed(2)} deducted. RM ${penalty.toFixed(2)} sent to ${boundPartner} and broadcasted!`, [{ text: "OK", onPress: () => setShowWarning(false) }]);
    }
  };

  // Executes a payment via GXBank, deducting from either the Main Account or the linked pocket.
  const handleGXBankPayment = () => {
    const amount = parseFloat(gxPaymentAmount);
    if (!amount || amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    if (!linkedGXPocket) {
      if (amount > totalBalance) {
        Alert.alert("Failed", "Insufficient balance in Main Account.");
        return;
      }
      setTotalBalance(prev => prev - amount);
      Alert.alert("Success", `RM ${amount.toFixed(2)} swiped via GXBank from Main Account.`);
    } else {
      const ziniData = (membersData[linkedGXPocket] || []).find((m: any) => m.id === 'z') || { saved: 0 };
      if (amount > ziniData.saved) {
        Alert.alert("Failed", `Insufficient funds in ${squadGoals[linkedGXPocket]?.title}.`);
        return;
      }
      
      setMembersData((prev: any) => {
        const squadMembers = prev[linkedGXPocket] || [];
        const updatedMembers = squadMembers.map((m: any) => {
          if (m.id === 'z') {
            return { ...m, saved: m.saved - amount };
          }
          return m;
        });
        return { ...prev, [linkedGXPocket]: updatedMembers };
      });

      const newActivity = {
        id: Date.now(),
        user: 'Zini',
        msg: `swiped RM ${amount.toFixed(2)} using GX Card from this pocket! 💳`,
        cat: squadGoals[linkedGXPocket]?.title || 'Pocket',
        icon: 'credit-card-outline',
        color: '#22d3ee' 
      };

      setActivities((prev: any) => ({
        ...prev,
        [linkedGXPocket]: [newActivity, ...(prev[linkedGXPocket] || [])],
        All: [newActivity, ...(prev.All || [])]
      }));

      Alert.alert("Success", `RM ${amount.toFixed(2)} swiped via GX Card from ${squadGoals[linkedGXPocket]?.title}.`);
    }

    setShowGXBankModal(false);
    setGxPaymentAmount('');
  };

  // Renders the progress bar for the currently active squad's savings goal.
  const renderGoalProgress = () => {
    const goal = squadGoals[activeSquad] || { title: 'New Squad Goal', target: 1000 };
    
    const ziniData = (membersData[activeSquad] || []).find((m: any) => m.id === 'z') || { saved: 0 };
    const currentSaved = ziniData.saved;
    const progressPercent = Math.min((currentSaved / goal.target) * 100, 100) + '%';
    
    return (
      <View style={styles.goalContainer}>
        <Text style={styles.goalTitle}>
          {goal.title} 🎯
        </Text>
        
        <TouchableOpacity 
          onPress={() => { setEditGoalAmount(goal.target.toString()); setShowEditGoalModal(true); }} 
          style={{flexDirection: 'row', alignItems: 'flex-start', marginTop: 8, marginBottom: 4}}
        >
          <Text style={[styles.goalAmount, { flex: 1, flexWrap: 'wrap', lineHeight: 18 }]}>
            Overall: RM {currentSaved} / RM {goal.target} per person
          </Text>
          <MaterialCommunityIcons name="pencil-outline" size={14} color="#22d3ee" style={{marginLeft: 5, marginTop: 2}} />
        </TouchableOpacity>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, {width: progressPercent as any}]} />
        </View>

        <TouchableOpacity style={styles.depositBtn} onPress={() => setShowDepositModal(true)}>
          <MaterialCommunityIcons name="piggy-bank" size={16} color="white" />
          <Text style={styles.depositBtnText}>Save Money</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Renders the ranked list of squad members based on their weekly savings.
  const renderDynamicLeaderboard = () => {
    const currentMembers = membersData[activeSquad] || [];
    
    const sortedMembers = [...currentMembers].sort((a: any, b: any) => {
      const weeklyA = a.weekly || 0;
      const weeklyB = b.weekly || 0;
      return weeklyB - weeklyA; 
    });
    
    const medals = ["🥇", "🥈", "🥉"];

    return (
      <View>
        {sortedMembers.map((member: any, index: number) => {
          const isFirstPlace = index === 0;
          const medal = medals[index] || "🏅"; 
          
          const bonusTag = isFirstPlace ? "Weekly Reward 0.5% Interest 💸" : null;
          
          const scoreDisplay = `Weekly Saved: RM ${member.weekly || 0}`;

          return (
            <View key={member.id}>
              {renderRankRow(medal, member.name, scoreDisplay, member.status, bonusTag, member.saved, member.target)}
              {index < sortedMembers.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
      </View>
    );
  };

  // Collect all states for the Modals component
  const modalStates = {
    showWarning, showCreateModal, showInviteModal, showJoinModal, showDepositModal, showHistoryModal, showMembersModal, showEditGoalModal, showBindPartnerModal, showCompletionModal, showGXBankModal,
    aiMode, squadName, squadGoalAmount, squadUsableStartDate, squadUsableEndDate, inviteMichelle, inviteXinying, joinCodeInput, depositAmount, depositFreq, editGoalAmount, gxPaymentAmount, linkedGXPocket, activeSquad, squads, squadGoals, membersData, activities, completedAmount
  };

  // Collect all actions for the Modals component
  const modalActions = {
    setShowWarning, setShowCreateModal, setShowInviteModal, setShowJoinModal, setShowDepositModal, setShowHistoryModal, setShowMembersModal, setShowEditGoalModal, setShowBindPartnerModal, setShowCompletionModal, setShowGXBankModal, setBoundPartner, setPartnerPenaltyBalance,
    setSquadName, setSquadGoalAmount, setSquadUsableStartDate, setSquadUsableEndDate, setInviteMichelle, setInviteXinying, setJoinCodeInput, setDepositAmount, setDepositFreq, setEditGoalAmount, setGxPaymentAmount, setLinkedGXPocket,
    handleCreateSquad, handleJoinSquad, handleDeposit, handleEditGoal, handleProceedTransaction, handleGXBankPayment, copyToClipboard, getJoinCode,
    getWarningTitle, getWarningBodyText, getProceedButtonText, getCancelButtonText
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a0b2e" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* ========================================== */}
        {/* HOME Page                                  */}
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
                <Text style={styles.balanceAmount}>RM {totalBalance.toFixed(2)}</Text>
                <Ionicons name="eye-outline" size={20} color="white" style={{ marginLeft: 10 }} />
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionItem}><View style={styles.actionIconBg}><Ionicons name="add" size={24} color="white" /></View><Text style={styles.actionText}>Add money</Text></TouchableOpacity>
              <TouchableOpacity style={styles.actionItem} onPress={() => setShowWarning(true)}><View style={styles.actionIconBg}><MaterialCommunityIcons name="qrcode-scan" size={20} color="white" /></View><Text style={styles.actionText}>Scan QR</Text></TouchableOpacity>
              <TouchableOpacity style={styles.actionItem} onPress={() => setShowGXBankModal(true)}><View style={styles.actionIconBg}><MaterialCommunityIcons name="credit-card-wireless-outline" size={20} color="white" /></View><Text style={styles.actionText}>Swipe GX Card</Text></TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your everyday account</Text>
              <MaterialCommunityIcons name="credit-card-outline" size={24} color="#6b7280" />
            </View>

            <View style={styles.cardsContainer}>
              <View style={[styles.card, styles.mainCard]}><Text style={styles.cardLabel}>Main account</Text><Text style={styles.cardAmount}>RM {totalBalance.toFixed(2)}</Text></View>
              <View style={[styles.card, styles.pocketCard]}>
                <Text style={styles.cardLabelBold}>Pockets</Text><Text style={styles.cardSubText}>Earn 3.55% p.a.</Text>
                <TouchableOpacity style={styles.createButton}><Text style={styles.createButtonText}>Create</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ========================================== */}
        {/* SamaSave Dashboard                         */}
        {/* ========================================== */}
        {activeTab === 'SamaSave' && (
          <View style={styles.dashboardContainer}>
            <View style={styles.dashboardHeader}>
              <Text style={styles.dashboardTitle}>Resilience League 🏆</Text>
              <Text style={styles.dashboardSubtitle}>Who is surviving the impulse?</Text>
            </View>

            {/* Accountability Partner Section */}
            <View style={styles.vaultCard}>
              <View style={styles.vaultInfo}>
                <Text style={styles.vaultTitle} numberOfLines={2}>
                  Accountability Partner
                </Text>
                
                {boundPartner ? (
                  <View>
                    <Text style={[styles.vaultSub, { color: 'white', marginTop: 8 }]}>🤝 Linked to: <Text style={{fontWeight: 'bold', color: '#22d3ee'}}>{boundPartner}</Text></Text>
                  </View>
                ) : (
                  <Text style={[styles.vaultSub, { marginTop: 8, lineHeight: 18 }]}>No one linked yet. Link a friend to receive your impulse penalties and keep you on track!</Text>
                )}
              </View>

              {boundPartner ? (
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.vaultSub, { marginTop: 0, marginBottom: 4 }]}>Total penalty given</Text>
                  <Text style={styles.vaultAmount}>RM {partnerPenaltyBalance.toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => setBoundPartner(null)} style={{ marginTop: 8 }}>
                    <Text style={{ color: '#f43f5e', fontSize: 12, fontWeight: 'bold' }}>Unlink 🚫</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={[styles.depositBtn, { backgroundColor: '#22d3ee' }]} onPress={() => setShowBindPartnerModal(true)}>
                  <Text style={[styles.depositBtnText, { color: '#11081f', marginLeft: 0 }]}>Link a Friend 🤝</Text>
                </TouchableOpacity>
              )}
            </View>

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


            
            <View style={styles.leaderboardBox}>
              {activeSquad === 'All' ? (
                <View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
                    <Text style={[styles.gridHeader, {marginBottom: 0}]}>Your Pockets 📁</Text>
                  </View>
                  {squads.map((squad) => {
                    const goal = squadGoals[squad.id] || { target: 1000 };
                    const ziniData = (membersData[squad.id] || []).find((m: any) => m.id === 'z') || { saved: 0 };
                    const progressPercent = Math.min((ziniData.saved / goal.target) * 100, 100) + '%';
                    return (
                      <TouchableOpacity key={squad.id} style={[styles.categoryCard, { width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', opacity: squad.isCompleted ? 0.6 : 1 }]} onPress={() => setActiveSquad(squad.id)}>
                        <View style={{flex: 1}}>
                          <Text style={[styles.categoryCardTitle, { fontSize: 16 }]}>{squad.name} {squad.isCompleted ? '(Done)' : ''}</Text>
                          <Text style={{color: '#9ca3af', fontSize: 12, marginTop: 4}}>My Progress: RM {ziniData.saved} / RM {goal.target}</Text>
                          <View style={[styles.progressBarBg, { height: 4, marginTop: 8, marginBottom: 0, width: '80%' }]}>
                            <View style={[styles.progressBarFill, {width: progressPercent as any}]} />
                          </View>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#7c3aed" />
                      </TouchableOpacity>
                    );
                  })}
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                    <TouchableOpacity style={[styles.createMainButton, {flex: 1, marginRight: 5, marginTop: 0}]} onPress={() => setShowCreateModal(true)}>
                      <Ionicons name="add-circle" size={20} color="white" style={{marginRight: 6}}/>
                      <Text style={styles.inviteButtonText}>Create Pocket</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.createMainButton, {flex: 1, marginLeft: 5, marginTop: 0, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#22d3ee'}]} onPress={() => setShowJoinModal(true)}>
                      <MaterialCommunityIcons name="login" size={20} color="#22d3ee" style={{marginRight: 6}}/>
                      <Text style={[styles.inviteButtonText, {color: '#22d3ee'}]}>Join Pocket</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  <TouchableOpacity onPress={() => setActiveSquad('All')} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <MaterialCommunityIcons name="arrow-left" size={20} color="#22d3ee" />
                    <Text style={{ color: '#22d3ee', fontWeight: 'bold', marginLeft: 5 }}>Back to Pockets</Text>
                  </TouchableOpacity>
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

                  {squads.find((s:any) => s.id === activeSquad)?.isCompleted ? (
                    <View style={{ backgroundColor: '#374151', padding: 15, borderRadius: 10, marginBottom: 15, alignItems: 'center' }}>
                      <Text style={{ color: '#9ca3af', fontWeight: 'bold' }}>This pocket is completed and closed. 🔒</Text>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity style={[styles.depositBtn, { alignSelf: 'center', backgroundColor: '#4b5563', marginBottom: 15 }]} onPress={handleSimulateCompletion}>
                        <Text style={styles.depositBtnText}>Simulate End Date 📅</Text>
                      </TouchableOpacity>
                      
                      <View style={{ backgroundColor: linkedGXPocket === activeSquad ? 'rgba(16, 185, 129, 0.1)' : '#1f1b2e', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: linkedGXPocket === activeSquad ? '#10b981' : '#2d1b4e', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{flex: 1, marginRight: 10}}>
                          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Link to GX Card 💳</Text>
                          <Text style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>
                            {linkedGXPocket === activeSquad ? 'Card swipes will prioritize deducting from this pocket.' : 'Make this the default payment source for your physical card during the usable period'}
                          </Text>
                        </View>
                        <TouchableOpacity 
                          onPress={() => setLinkedGXPocket(linkedGXPocket === activeSquad ? null : activeSquad)}
                          style={{
                            width: 50, height: 28, borderRadius: 14, 
                            backgroundColor: linkedGXPocket === activeSquad ? '#10b981' : '#4b5563',
                            padding: 2, justifyContent: 'center',
                            alignItems: linkedGXPocket === activeSquad ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: 'white' }} />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {renderGoalProgress()}

                  {/* WEEKLY REWARD INFO BOX */}
                  <View style={{ backgroundColor: '#2d1b4e', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#7c3aed' }}>
                    <Text style={{ color: '#22d3ee', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                      ⏳ Weekly Reward Snapshot (Mon 00:00)
                    </Text>
                    <Text style={{ color: '#9ca3af', fontSize: 11, lineHeight: 16 }}>
                      Rank #1 earns 0.5% interest on their NEW weekly deposits (Maximum of RM 5.00/week 💸)
                    </Text>
                  </View>

                  {renderDynamicLeaderboard()}
                </View>
              )}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Savage Activity Feed 👀</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(true)}><Text style={styles.seeAllText}>See All &gt;</Text></TouchableOpacity>
            </View>
            
            <View style={styles.feedBox}>
              {(activities[activeSquad] || []).slice(0, 3).map((item: any) => (
                <View key={item.id} style={styles.feedItem}>
                  <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.feedText}><Text style={styles.feedName}>{item.user}</Text> {item.msg}</Text>
                    <Text style={styles.feedCategoryLabel}>in {item.cat} • Just now</Text>
                  </View>
                </View>
              ))}
              {(!activities[activeSquad] || activities[activeSquad].length === 0) && (
                 <View style={{ padding: 15, alignItems: 'center' }}>
                    <MaterialCommunityIcons name="sleep" size={30} color="#6b7280" />
                    <Text style={{ color: '#9ca3af', fontSize: 13, marginTop: 8 }}>Quiet here... No activity yet.</Text>
                 </View>
              )}
            </View>

            {activeSquad !== 'All' && (
              <TouchableOpacity style={styles.inviteButton} onPress={() => setShowInviteModal(true)}>
                <Ionicons name="person-add" size={18} color="white" style={{marginRight: 8}}/>
                <Text style={styles.inviteButtonText}>Invite Friends</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Extracted Modals Component */}
      <SamaSaveModals state={modalStates} actions={modalActions} />

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

// Renders a single row in the squad leaderboard, displaying the user's rank and score.
const renderRankRow = (medal: any, name: any, score: any, status: any, bonusText: any = null, saved: any = 0, target: any = 1000) => {
  const progressPercent = Math.min((saved / target) * 100, 100) + '%';
  return (
  <View style={styles.rankRow}>
    <Text style={styles.rankMedal}>{medal}</Text>
    <View style={styles.rankInfo}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.rankName}>{name}</Text>
          {bonusText && (
            <View style={styles.bonusBadge}>
              <Text style={styles.bonusText}>{bonusText}</Text>
            </View>
          )}
        </View>
        <Text style={styles.rankStatusSafe}>{score}</Text>
      </View>
      <View style={[styles.progressBarBg, { height: 4, marginTop: 6, marginBottom: 4 }]}>
        <View style={[styles.progressBarFill, {width: progressPercent as any, backgroundColor: status.includes('Safe') || status.includes('Ready') ? '#10b981' : (status.includes('Warning') ? '#f59e0b' : '#22d3ee')}]} />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{color: '#9ca3af', fontSize: 10}}>Progress: RM {saved} / {target}</Text>
        <Text style={styles.rankStatusSafe}>{status}</Text>
      </View>
    </View>
  </View>
)};

// Renders a navigation item icon and label for the bottom navigation bar.
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
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 15, position: 'relative' },
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
  dashboardContainer: { marginTop: 10 },
  dashboardTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  dashboardSubtitle: { color: '#9ca3af', fontSize: 14 },
  dashboardHeader: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  
  vaultCard: { backgroundColor: '#2d1b4e', borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#7c3aed', marginBottom: 15 },
  vaultInfo: { flex: 1, marginRight: 10 },
  vaultTitle: { color: 'white', fontSize: 15, fontWeight: 'bold', flexShrink: 1 },
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
  goalTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  goalAmount: { color: '#22d3ee', fontSize: 13, fontWeight: 'bold' },
  progressBarBg: { height: 8, backgroundColor: '#2d1b4e', borderRadius: 4, marginTop: 14, marginBottom: 15 },
  progressBarFill: { height: 8, backgroundColor: '#22d3ee', borderRadius: 4 },
  depositBtn: { backgroundColor: '#7c3aed', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  depositBtnText: { color: 'white', fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
  
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
  seeAllText: { color: '#7c3aed', fontSize: 12, fontWeight: 'bold' },
  divider: { width: '100%', height: 1, backgroundColor: '#2d1b4e', marginVertical: 15 },
});