import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Alert, TextInput, KeyboardAvoidingView, Platform, Clipboard } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export function SamaSaveModals({ state, actions }: any) {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const {
    showWarning, showCreateModal, showInviteModal, showJoinModal, showDepositModal, showHistoryModal, showMembersModal, showEditGoalModal, showBindPartnerModal, showCompletionModal, showGXBankModal, showCreatePocketOptionsModal, showBonusPocketModal,
    aiMode, squadName, squadGoalAmount, squadUsableStartDate, squadUsableEndDate, squadTag, customTag, showCompletionOptions, inviteMichelle, inviteXinying, joinCodeInput, depositAmount, depositFreq, editGoalAmount, gxPaymentAmount, linkedGXPocket, activeSquad, squads, squadGoals, membersData, activities, completedAmount, bonusPocketBalance, totalBalance
  } = state;

  const {
    setShowWarning, setShowCreateModal, setShowInviteModal, setShowJoinModal, setShowDepositModal, setShowHistoryModal, setShowMembersModal, setShowEditGoalModal, setShowBindPartnerModal, setShowCompletionModal, setShowGXBankModal, setBoundPartner, setPartnerPenaltyBalance, setShowCreatePocketOptionsModal, setShowBonusPocketModal, setBonusPocketBalance,
    setSquadName, setSquadGoalAmount, setSquadUsableStartDate, setSquadUsableEndDate, setSquadTag, setCustomTag, setShowCompletionOptions, setInviteMichelle, setInviteXinying, setJoinCodeInput, setDepositAmount, setDepositFreq, setEditGoalAmount, setGxPaymentAmount, setLinkedGXPocket,
    handleCreateSquad, handleJoinSquad, handleDeposit, handleEditGoal, handleProceedTransaction, handleGXBankPayment, handleCompleteToMain, handleCompleteToVault, handleCompleteToPocket, copyToClipboard, getJoinCode,
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
              <Text style={styles.createTitle}>Create New Pocket 🚀</Text>
              
              <TextInput style={styles.inputField} placeholder="e.g. Graduation Trip" placeholderTextColor="#6b7280" value={squadName} onChangeText={setSquadName} underlineColorAndroid="transparent" />
              <TextInput style={styles.inputField} placeholder="Target Goal Amount (RM)" placeholderTextColor="#6b7280" value={squadGoalAmount} onChangeText={setSquadGoalAmount} keyboardType="numeric" underlineColorAndroid="transparent" />
              
              <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={[styles.inputField, {justifyContent: 'center'}]}>
                <Text style={{ color: squadUsableStartDate ? 'white' : '#6b7280', fontSize: 16 }}>
                  {squadUsableStartDate ? `Usable From: ${squadUsableStartDate}` : "Usable From (Select Date)"}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={squadUsableStartDate ? new Date(squadUsableStartDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event: any, selectedDate?: Date) => {
                    setShowStartDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setSquadUsableStartDate(selectedDate.toISOString().split('T')[0]);
                    }
                  }}
                />
              )}

              <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={[styles.inputField, {justifyContent: 'center'}]}>
                <Text style={{ color: squadUsableEndDate ? 'white' : '#6b7280', fontSize: 16 }}>
                  {squadUsableEndDate ? `Usable Until: ${squadUsableEndDate}` : "Usable Until (Select Date)"}
                </Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={squadUsableEndDate ? new Date(squadUsableEndDate) : new Date()}
                  mode="date"
                  display="default"
                  minimumDate={squadUsableStartDate ? new Date(squadUsableStartDate) : undefined}
                  onChange={(event: any, selectedDate?: Date) => {
                    setShowEndDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setSquadUsableEndDate(selectedDate.toISOString().split('T')[0]);
                    }
                  }}
                />
              )}

              {/* Category Selector */}
              <View style={{ marginTop: 10, marginBottom: 5 }}>
                <Text style={[styles.inviteTitle, { marginBottom: 5 }]}>Category:</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {['Trip', 'Shopping', 'Concert', 'Tech', 'Other'].map((tag) => (
                    <TouchableOpacity 
                      key={tag}
                      onPress={() => setSquadTag(tag)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 15,
                        backgroundColor: squadTag === tag ? '#22d3ee' : '#2d1b4e',
                        marginRight: 8,
                        marginBottom: 8
                      }}
                    >
                      <Text style={{ color: squadTag === tag ? '#11081f' : '#9ca3af', fontWeight: 'bold', fontSize: 12 }}>{tag}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {squadTag === 'Other' && (
                  <TextInput 
                    style={[styles.inputField, { marginTop: 5, paddingVertical: 8, fontSize: 13 }]} 
                    placeholder="Type custom category..." 
                    placeholderTextColor="#6b7280" 
                    value={customTag} 
                    onChangeText={setCustomTag} 
                    underlineColorAndroid="transparent" 
                  />
                )}
              </View>

              <View style={styles.inviteSection}>
                <Text style={styles.inviteTitle}>Initial Members:</Text>
                {renderInviteRow("Michelle", inviteMichelle, setInviteMichelle)}
                {renderInviteRow("Xinying", inviteXinying, setInviteXinying)}
              </View>
              
              <TouchableOpacity style={styles.createSubmitButton} onPress={handleCreateSquad}><Text style={styles.createSubmitText}>Start Pocket</Text></TouchableOpacity>
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
              <Text style={styles.createTitle}>Join a Pocket 🤝</Text>
              <Text style={styles.inviteTitle}>Enter the secret code from your friend to join their saving pocket!</Text>
              
              <TextInput 
                style={[styles.inputField, { marginTop: 15, textTransform: 'uppercase', textAlign: 'center', fontSize: 20, letterSpacing: 2 }]} 
                placeholder="e.g. SAMA-BFF-2026" 
                placeholderTextColor="#6b7280" 
                value={joinCodeInput} 
                onChangeText={setJoinCodeInput} 
                autoCapitalize="characters"
              />

              <TouchableOpacity style={[styles.createSubmitButton, { backgroundColor: '#22d3ee' }]} onPress={handleJoinSquad}>
                <Text style={[styles.createSubmitText, { color: '#11081f' }]}>Join Pocket</Text>
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
            <Text style={styles.inviteCodeSub}>Share this code to save together in {squadGoals[activeSquad]?.title || 'this pocket'}!</Text>
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
              <Text style={styles.historyTitle}>Pocket Members 👥</Text>
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

      {/* Completion Modal */}
      <Modal visible={showCompletionModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.createBox, { borderColor: '#10b981', borderWidth: 2 }]}>
            <View style={{ alignItems: 'center' }}>
              <MaterialCommunityIcons name="party-popper" size={60} color="#10b981" />
              <Text style={[styles.createTitle, { marginTop: 15, textAlign: 'center' }]}>You did it!</Text>
              <Text style={[styles.inviteTitle, { textAlign: 'center', lineHeight: 22, fontSize: 16, marginBottom: 20 }]}>
                Zini, you survived with RM {completedAmount} left! What would you like to do with it?
              </Text>
            </View>

            {!showCompletionOptions ? (
              <View>
                <TouchableOpacity style={[styles.createSubmitButton, { backgroundColor: '#10b981', marginBottom: 10 }]} onPress={handleCompleteToMain}>
                  <Text style={styles.createSubmitText}>🏦 Transfer to Main Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.createSubmitButton, { backgroundColor: '#22d3ee', marginBottom: 10 }]} onPress={() => setShowCompletionOptions(true)}>
                  <Text style={styles.createSubmitText}>📁 Transfer to another Pocket</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.createSubmitButton, { backgroundColor: '#f59e0b' }]} onPress={handleCompleteToVault}>
                  <Text style={styles.createSubmitText}>🔒 Transfer to GX Bonus Pocket</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={[styles.inviteTitle, { marginBottom: 10, textAlign: 'center' }]}>Select a Pocket to transfer RM {completedAmount}:</Text>
                <ScrollView style={{ maxHeight: 150, marginBottom: 15 }}>
                  {squads.filter((s: any) => !s.isCompleted && s.id !== activeSquad).map((squad: any) => (
                    <TouchableOpacity 
                      key={squad.id} 
                      style={{ padding: 15, backgroundColor: '#2d1b4e', borderRadius: 10, marginBottom: 8 }}
                      onPress={() => handleCompleteToPocket(squad.id)}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>{squad.name}</Text>
                    </TouchableOpacity>
                  ))}
                  {squads.filter((s: any) => !s.isCompleted && s.id !== activeSquad).length === 0 && (
                    <Text style={{ color: '#9ca3af', textAlign: 'center', padding: 10 }}>No other active pockets available.</Text>
                  )}
                </ScrollView>
                <TouchableOpacity onPress={() => setShowCompletionOptions(false)}>
                  <Text style={[styles.cancelLinkText, { textAlign: 'center' }]}>Back to Options</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* GXBank Payment Modal */}
      <Modal visible={showGXBankModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.createBox}>
              <Text style={styles.createTitle}>Simulate GX Card Swipe 💳</Text>
              
              <TextInput 
                style={[styles.inputField, { fontSize: 24, textAlign: 'center', fontWeight: 'bold', color: '#10b981' }]} 
                placeholder="RM 0.00" 
                placeholderTextColor="#6b7280" 
                value={gxPaymentAmount} 
                onChangeText={setGxPaymentAmount} 
                keyboardType="numeric" 
              />

              <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#10b981', marginBottom: 20, alignItems: 'center' }}>
                <Text style={{ color: '#9ca3af', fontSize: 12, marginBottom: 5 }}>Current Payment Source</Text>
                <Text style={{ color: '#10b981', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                  {linkedGXPocket ? (squadGoals[linkedGXPocket]?.title || 'Linked Pocket') : 'Main Account'}
                </Text>
                {linkedGXPocket && (
                  <Text style={{ color: '#e5e7eb', fontSize: 13, marginTop: 5 }}>
                    Available to swipe: RM {((membersData[linkedGXPocket] || []).find((m: any) => m.id === 'z') || { saved: 0 }).saved}
                  </Text>
                )}
              </View>

              <TouchableOpacity style={[styles.createSubmitButton, { backgroundColor: '#10b981' }]} onPress={handleGXBankPayment}>
                <Text style={styles.createSubmitText}>Swipe Card</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowGXBankModal(false)}>
                <Text style={styles.cancelLinkText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* Create Pocket Options Modal */}
      <Modal visible={showCreatePocketOptionsModal} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: '#11081f', padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 20 }}>
            <TouchableOpacity onPress={() => setShowCreatePocketOptionsModal(false)}>
              <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Create pocket</Text>
          <Text style={{ color: '#e5e7eb', fontSize: 16, marginBottom: 30, lineHeight: 24 }}>Choose from two pocket options to help you crush your saving goals.</Text>

          <View style={{ backgroundColor: '#1f1b2e', borderRadius: 15, overflow: 'hidden' }}>
            <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', opacity: 0.5, borderBottomWidth: 1, borderBottomColor: '#2d1b4e' }}>
              <MaterialCommunityIcons name="currency-usd-circle-outline" size={30} color="white" />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>Savings Pocket</Text>
                <Text style={{ color: '#9ca3af', fontSize: 14 }}>Earn 2.00% p.a. interest every day.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>

            <TouchableOpacity 
              style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => { setShowCreatePocketOptionsModal(false); setShowBonusPocketModal(true); }}
            >
              <MaterialCommunityIcons name="clock-fast" size={30} color="white" />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginRight: 8 }}>Bonus Pocket</Text>
                  <View style={{ backgroundColor: '#f43f5e', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>NEW</Text>
                  </View>
                </View>
                <Text style={{ color: '#9ca3af', fontSize: 14 }}>Get up to 3.55% p.a. interest on your savings.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bonus Pocket Modal */}
      <Modal visible={showBonusPocketModal} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: '#11081f', padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 20 }}>
            <TouchableOpacity onPress={() => setShowBonusPocketModal(false)}>
              <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Your Bonus Pocket</Text>
          
          <View style={{ backgroundColor: '#2d1b4e', borderRadius: 15, padding: 20, marginBottom: 15 }}>
            <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>RM<Text style={{color: '#c4b5fd'}}>{bonusPocketBalance.toFixed(2)}</Text></Text>
            <Text style={{ color: '#e5e7eb', fontSize: 14, marginTop: 10 }}>Main account balance: RM{totalBalance.toFixed(2)}</Text>
          </View>

          <View style={{ backgroundColor: '#2d1b4e', borderRadius: 15, padding: 20 }}>
            <Text style={{ color: '#9ca3af', fontSize: 14, marginBottom: 5 }}>Estimated total (incl. interest)</Text>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>RM {(bonusPocketBalance * 1.0355).toFixed(2)}</Text>
            
            <View style={{ width: '100%', height: 1, backgroundColor: '#3f2e60', marginBottom: 20 }} />

            <Text style={{ color: '#9ca3af', fontSize: 14, marginBottom: 5 }}>Total interest</Text>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>3.55% p.a</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <View>
                <Text style={{ color: '#9ca3af', fontSize: 14, marginBottom: 5 }}>Base interest (% p.a.)</Text>
                <Text style={{ color: 'white', fontSize: 16 }}>-</Text>
              </View>
              <View>
                <Text style={{ color: '#9ca3af', fontSize: 14, marginBottom: 5 }}>Bonus interest (% p.a.)</Text>
                <Text style={{ color: '#10b981', fontSize: 16 }}>-</Text>
              </View>
            </View>

            <Text style={{ color: '#9ca3af', fontSize: 14, marginBottom: 5 }}>Savings period</Text>
            <Text style={{ color: 'white', fontSize: 16, marginBottom: 20 }}>-</Text>
            
            <View style={{ width: '100%', height: 1, backgroundColor: '#3f2e60', marginBottom: 20 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>View interest rates and tenures</Text>
              <Ionicons name="chevron-down" size={20} color="white" />
            </View>
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
  pocketSelectBtn: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#2d1b4e', marginBottom: 10, backgroundColor: '#11081f' },
  pocketSelectBtnActive: { borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  pocketSelectText: { color: '#e5e7eb', fontSize: 14, fontWeight: 'bold' },
  pocketSelectTextActive: { color: '#10b981' },
});
