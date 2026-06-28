import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { theme: t } = useTheme();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.';
    if (!password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  const s = useMemo(() => styles(t), [t]);

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">

        <View style={s.logoBlock}>
          <Text style={s.logo}>Cooksta</Text>
          <Text style={s.logoSub}>Discover. Cook. Enjoy.</Text>
        </View>

        <View style={s.card}>
          {errors.general ? (
            <View style={s.alert}><Text style={s.alertText}>{errors.general}</Text></View>
          ) : null}

          <Text style={s.label}>Email address</Text>
          <TextInput
            style={[s.input, errors.email && s.inputErr]}
            placeholder="Email address"
            placeholderTextColor={t.textSub}
            value={email}
            onChangeText={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: '' })); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email ? <Text style={s.fieldErr}>{errors.email}</Text> : null}

          <Text style={s.label}>Password</Text>
          <TextInput
            style={[s.input, errors.password && s.inputErr]}
            placeholder="Password"
            placeholderTextColor={t.textSub}
            value={password}
            onChangeText={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: '' })); }}
            secureTextEntry
          />
          {errors.password ? <Text style={s.fieldErr}>{errors.password}</Text> : null}

          <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Sign in</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={s.link}>
              Don't have an account?{'  '}
              <Text style={s.linkAccent}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (t) => StyleSheet.create({
  flex:       { flex: 1, backgroundColor: t.bg },
  container:  { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoBlock:  { alignItems: 'center', marginBottom: 40 },
  logo:       { fontSize: 48, fontWeight: '800', color: t.accent, letterSpacing: 1 },
  logoSub:    { fontSize: 14, color: t.textSub, marginTop: 4 },
  card:       { backgroundColor: t.card, borderRadius: 18, padding: 24 },
  alert:      { backgroundColor: '#3d0a0a', borderRadius: 10, padding: 12, marginBottom: 16 },
  alertText:  { color: t.danger, fontSize: 13 },
  label:      { color: t.textSub, fontSize: 12, marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: t.bg, borderWidth: 1, borderColor: t.border,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13,
    color: t.text, fontSize: 15,
  },
  inputErr:   { borderColor: t.danger },
  fieldErr:   { color: t.danger, fontSize: 12, marginTop: 4 },
  btn: {
    backgroundColor: t.accent, borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 26,
  },
  btnText:    { color: '#fff', fontWeight: '700', fontSize: 16 },
  link:       { color: t.textSub, textAlign: 'center', marginTop: 18, fontSize: 13 },
  linkAccent: { color: t.accent, fontWeight: '700' },
});
