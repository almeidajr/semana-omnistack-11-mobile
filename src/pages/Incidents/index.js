import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import api from '../../services/api';

import styles from './styles';

import logoImg from '../../assets/logo.png';

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(loadIncidents, []);

  function loadIncidents() {
    if (loading) {
      return;
    }
    if (total > 0 && incidents.length === total) {
      return;
    }

    setLoading(true);

    api.get('incidents', { params: { page } }).then(response => {
      setIncidents([...incidents, ...response.data]);
      setTotal(response.headers['x-total-count']);
      setPage(page + 1);
      setLoading(false);
    });
  }

  function navigateToDetail(incident) {
    navigation.navigate('Detail', { incident });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>
          Total of <Text style={styles.headerTextBold}>{total} incidents</Text>.
        </Text>
      </View>

      <Text style={styles.title}>Welcome!</Text>

      <Text style={styles.description}>
        Choose one of the incidents below and save the day.
      </Text>

      <FlatList
        data={incidents}
        style={styles.incidentList}
        keyExtractor={incident => String(incident.id)}
        showsVerticalScrollIndicator={false}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        renderItem={({ item: incident }) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>NGO:</Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>

            <Text style={styles.incidentProperty}>Incident:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>VALUE:</Text>
            <Text style={styles.incidentValue}>
              {Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(incident.value)}
            </Text>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => {
                navigateToDetail(incident);
              }}
            >
              <Text style={styles.detailsButtonText}>Show more details</Text>
              <Feather name="arrow-right" size={16} color="#e02041"></Feather>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
