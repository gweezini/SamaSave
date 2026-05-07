import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Alert, TextInput, KeyboardAvoidingView, Platform, Clipboard } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export function SamaSaveModals({ state, actions }: any) {
  const {
    showWarning, showCreateModal, showInviteModal, showJoinModal, showDepositModal, showHistoryModal, showMembersModal, showEditGoalModal, showBindPartnerModal,
    aiMode, squadName, squadGoalAmount, inviteMichelle, inviteXinying, joinCodeInput, depositAmount, depositFreq, editGoalAmount, activeSquad, squadGoals, membersData, activities
  } = state;

  const {
    setShowWarning, setShowCreateModal, setShowInviteModal, setShowJoinModal, setShowDepositModal, setShowHistoryModal, setShowMembersModal, setShowEditGoalModal, setShowBindPartnerModal, setBoundPartner, setPartnerPenaltyBalance,
    setSquadName, setSquadGoalAmount, setInviteMichelle, setInviteXinying, setJoinCodeInput, setDepositAmount, setDepositFreq, setEditGoalAmount,
    handleCreateSquad, handleJoinSquad, handleDeposit, handleEditGoal, handleProceedTransaction, copyToClipboard, getJoinCode,
    getWarningTitle, getWarningBodyText, getProceedButtonText, getCancelButtonText
  } = actions;

  const renderInviteRow = (name: any, val: any, setVal: any) => (
    <TouchableOpacity style={styles.inviteRow} onPress={() => setVal(!val)}>
      <MaterialCommunityIcons name={val ? "checkbox-marked" : "checkbox-blank-outline"} size={24} color={val ? "#7c3aed" : "#6b7280"} />
      <Text style={styles.inviteName}>{name}</Text>
    </TouchableOpacity>
  );

  return (
    <>
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
            <TouchableOpacity style={styles.cancelTransactionButton} onPress={() => { Alert.alert("Victory", "Impulse stopped! No money deducted.", [{ text: "Done", onPress: () => setShowWarning(false) }]); }}>
              <Text style={styles.cancelTransactionText}>{getCancelButtonText()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bind Partner Modal */}
      <Modal visible={showBindPartnerModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.createBox}>
            <Text style={styles.createTitle}>Link Accountability Partner 🤝</Text>
            <Text style={styles.inviteTitle}>Choose a friend to receive your impulse penalties!</Text>
            
            <TouchableOpacity 
              style={[styles.createSubmitButton, { backgroundColor: '#1f1b2e', borderWidth: 1, borderColor: '#22d3ee', marginTop: 10 }]} 
              onPress={() => { setBoundPartner('Michelle'); setPartnerPenaltyBalance(0); setShowBindPartnerModal(false); Alert.alert('Linked!', 'Michelle is now your Accountability Partner.'); }}>
              <Text style={[styles.createSubmitText, { color: '#22d3ee' }]}>Michelle</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.createSubmitButton, { backgroundColor: '#1f1b2e', borderWidth: 1, borderColor: '#f43f5e' }]} 
              onPress={() => { setBoundPartner('Xinying'); setPartnerPenaltyBalance(0); setShowBindPartnerModal(false); Alert.alert('Linked!', 'Xinying is now your Accountability Partner.'); }}>
              <Text style={[styles.createSubmitText, { color: '#f43f5e' }]}>Xinying</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowBindPartnerModal(false)} style={{marginTop: 10}}>
              <Text style={styles.cancelLinkText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Squad Creation Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
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
        </KeyboardAvoidingView>
      </Modal>

      {/* Join Squad via Code Modal */}
      <Modal visible={showJoinModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.createBox}>
              <Text style={styles.createTitle}>Join a Squad 🤝</Text>
              <Text style={styles.inviteTitle}>Enter the secret code from your friend to join their saving squad!</Text>
              
              <TextInput 
                style={[styles.inputField, { marginTop: 15, textTransform: 'uppercase', textAlign: 'center', fontSize: 20, letterSpacing: 2 }]} 
                placeholder="e.g. SAMA-BFF-2026" 
                placeholderTextColor="#6b7280" 
                value={joinCodeInput} 
                onChangeText={setJoinCodeInput} 
                autoCapitalize="characters"
              />

              <TouchableOpacity style={[styles.createSubmitButton, { backgroundColor: '#22d3ee' }]} onPress={handleJoinSquad}>
                <Text style={[styles.createSubmitText, { color: '#11081f' }]}>Join Squad</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowJoinModal(false)}><Text style={styles.cancelLinkText}>Cancel</Text></TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Deposit Modal */}
      <Modal visible={showDepositModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.createBox}>
              <Text style={styles.createTitle}>Deposit to Pocket 💰</Text>
              <Text style={styles.inviteTitle}>How much would you like to save into {squadGoals[activeSquad]?.title}?</Text>
              
              <TextInput 
                style={[styles.inputField, { fontSize: 24, textAlign: 'center', fontWeight: 'bold', color: '#22d3ee' }]} 
                placeholder="RM 0.00" 
                placeholderTextColor="#6b7280" 
                value={depositAmount} 
                onChangeText={setDepositAmount} 
                keyboardType="numeric" 
              />

              <Text style={styles.inviteTitle}>Auto-deduct Frequency:</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25}}>
                {['One-time', 'Daily', 'Weekly', 'Monthly'].map((freq) => (
                  <TouchableOpacity 
                    key={freq} 
                    onPress={() => setDepositFreq(freq)}
                    style={{
                      flex: 1, 
                      paddingVertical: 8, 
                      marginHorizontal: 4, 
                      borderRadius: 8, 
                      borderWidth: 1, 
                      alignItems: 'center',
                      borderColor: depositFreq === freq ? '#22d3ee' : '#2d1b4e',
                      backgroundColor: depositFreq === freq ? 'rgba(34, 211, 238, 0.1)' : '#11081f'
                    }}
                  >
                    <Text style={{color: depositFreq === freq ? '#22d3ee' : '#6b7280', fontSize: 11, fontWeight: 'bold'}}>
                      {freq}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={[styles.createSubmitButton, { backgroundColor: '#10b981' }]} onPress={handleDeposit}>
                <Text style={styles.createSubmitText}>Confirm Deposit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDepositModal(false)}><Text style={styles.cancelLinkText}>Cancel</Text></TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Target Goal Modal */}
      <Modal visible={showEditGoalModal} animationType="fade" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.createBox}>
              <Text style={styles.createTitle}>Update Goal 🎯</Text>
              <Text style={styles.inviteTitle}>New target amount for {squadGoals[activeSquad]?.title}:</Text>
              <TextInput style={styles.inputField} placeholder="Enter new target (RM)" placeholderTextColor="#6b7280" value={editGoalAmount} onChangeText={setEditGoalAmount} keyboardType="numeric" />
              <TouchableOpacity style={styles.createSubmitButton} onPress={handleEditGoal}><Text style={styles.createSubmitText}>Save Changes</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setShowEditGoalModal(false)}><Text style={styles.cancelLinkText}>Cancel</Text></TouchableOpacity>
            </View>
          </View>
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
              {(membersData[activeSquad] || [{ id: 'z', name: 'Zini', initial: 'Z', color: '#7c3aed' }]).map((m: any) => (
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
              {(activities[activeSquad] || activities.All).map((item: any) => (
                <View key={item.id} style={styles.historyItem}>
                  <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
                  <View style={{ marginLeft: 15, flex: 1 }}>
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
            </ScrollView>
            <TouchableOpacity style={styles.closeHistoryButton} onPress={() => setShowHistoryModal(false)}><Text style={styles.closeHistoryText}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
  memberStatus: { color: '#22d3ee', fontSize: 12, marginTop: 2 },
  feedText: { color: '#e5e7eb', fontSize: 13, flex: 1, lineHeight: 18 },
  feedName: { fontWeight: 'bold', color: 'white' },
  feedCategoryLabel: { color: '#7c3aed', fontSize: 10, fontWeight: 'bold', marginTop: 3 },
});
