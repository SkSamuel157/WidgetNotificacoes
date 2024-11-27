import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Pusher from 'pusher-js';

const WidgetNotificacoes = () => {
    const [notificacoes, setNotificacoes] = useState([]);

    // Buscar notificações do servidor
    const fetchNotificacoes = async () => {
        try {
            const response = await fetch('http://10.0.2.2:5000/notifications');
            if (!response.ok) {
                throw new Error(`Erro ao buscar notificações: ${response.statusText}`);
            }
            const data = await response.json();
            setNotificacoes(data.slice(0, 3)); // Limitar a 3 notificações
        } catch (err) {
            console.error('Erro ao buscar notificações:', err.message);
        }
    };

    useEffect(() => {
        fetchNotificacoes();

        // Configuração do Pusher
        const pusher = new Pusher('dd78661dc83711748d87', {
            cluster: 'us2',
        });

        const channel = pusher.subscribe('my-channel');

        // Receber novas notificações
        channel.bind('my-event', (data) => {
            setNotificacoes((prev) => {
                const novasNotificacoes = [{ id: data.id, title: data.title, message: data.message }, ...prev];
                return novasNotificacoes.slice(0, 3); // Limitar a 3 notificações
            });
        });

        // Receber exclusões
        channel.bind('delete-event', (data) => {
            setNotificacoes((prev) => prev.filter((notificacao) => notificacao.id !== data.id));
        });


        return () => {
            pusher.unsubscribe('my-channel');
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Notificações</Text>
            <ScrollView>
                {notificacoes.length === 0 ? (
                    <Text style={styles.message}>Nenhuma notificação encontrada.</Text>
                ) : (
                    notificacoes.map((notificacao) => (
                        <View key={notificacao.id} style={styles.notificacao}>
                            <Text style={styles.title}>{notificacao.title}</Text>
                            <Text style={styles.message}>{notificacao.message}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f0f0f0',
        flex: 1,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    notificacao: {
        width: '100%',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    message: {
        fontSize: 14,
        color: '#555',
    },
});

export default WidgetNotificacoes;
