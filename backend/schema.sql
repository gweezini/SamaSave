CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  main_balance DECIMAL DEFAULT 0.00,
  accrued_cashback DECIMAL DEFAULT 0.00, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sama_pockets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES profiles(id),
  partner_id UUID REFERENCES profiles(id), 
  goal_name TEXT NOT NULL, 
  target_amount DECIMAL NOT NULL,
  current_savings DECIMAL DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  pledge_type TEXT CHECK (pledge_type IN ('No_Late_Night_Food', 'No_Shopee_Spree')), 
  penalty_amount DECIMAL DEFAULT 5.00, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  amount DECIMAL NOT NULL,
  merchant_category TEXT, 
  status TEXT CHECK (status IN ('Approved', 'Intercepted', 'Tax_Paid')), 
  impulse_score DECIMAL, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE social_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pocket_id UUID REFERENCES sama_pockets(id),
  actor_id UUID REFERENCES profiles(id),
  message_text TEXT, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);