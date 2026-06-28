import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const { theme: t } = useTheme();
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => {
    setFields((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!fields.name.trim()) e.name = 'Full name is required.';
    if (!fields.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(fields.email)) e.email = 'Enter a valid email.';
    if (!fields.password) e.password = 'Password is required.';
    else if (fields.password.length < 6) e.password = 'Minimum 6 characters.';
    if (!fields.confirm) e.confirm = 'Please confirm your password.';
    else if (fields.confirm !== fields.password) e.confirm = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(fields.name.trim(), fields.email.trim(), fields.password);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  const s = useMemo(() => styles(t), [t]);

  const renderField = (label, fkey, rest = {}) => (
    <React.Fragment key={fkey}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        style={[s.input, errors[fkey] && s.inputErr]}
        placeholder={label}
        placeholderTextColor={t.textSub}
        value={fields[fkey]}
        onChangeText={set(fkey)}
        {...rest}
      />
      {errors[fkey] ? <Text style={s.fieldErr}>{errors[fkey]}</Text> : null}
    </React.Fragment>
  );

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">

        <View style={s.header}>
          <Text style={s.brand}>Cooksta</Text>
          <Text style={s.title}>Create account</Text>
          <Text style={s.sub}>Join Cooksta and start discovering recipes</Text>
        </View>

        <View style={s.card}>
          {errors.general ? (
            <View style={s.alert}><Text style={s.alertText}>{errors.general}</Text></View>
          ) : null}

          {renderField('Full name', 'name', { autoCapitalize: 'words' })}
          {renderField('Email address', 'email', { keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false })}
          {renderField('Password', 'password', { secureTextEntry: true })}
          {renderField('Confirm password', 'confirm', { secureTextEntry: true })}

          <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Create account</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={s.link}>
              Already have an account?{'  '}
              <Text style={s.linkAccent}>Sign in</Text>
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
  header:     { alignItems: 'center', marginBottom: 32 },
  brand:      { fontSize: 40, fontWeight: '800', color: t.accent, letterSpacing: 1, marginBottom: 10 },
  title:      { fontSize: 32, fontWeight: '800', color: t.text },
  sub:        { fontSize: 14, color: t.textSub, marginTop: 6 },
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
