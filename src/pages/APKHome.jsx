import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useAuth } from '../context/AuthContext';

export default function APKHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);

  // Simular notificaciones de recordatorio
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simular notificaciones de citas (en una app real vendrían de la BD)
      const now = new Date();
      const mockNotifications = [
        {
          id: 1,
          title: '🔔 Recordatorio',
          message: 'Tu cita en Latotty es en 1 hora',
          time: new Date(now.getTime() + 60 * 60 * 1000), // 1 hora después
          type: 'reminder'
        },
        {
          id: 2,
          title: '📅 Nueva cita',
          message: 'Tienes una nueva cita confirmada para mañana',
          time: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutos después
          type: 'appointment'
        },
        {
          id: 3,
          title: '✅ Confirmación',
          message: 'Tu cita de hoy ha sido confirmada',
          time: new Date(now.getTime() + 5 * 60 * 1000), // 5 minutos después
          type: 'confirmation'
        }
      ];

      // Filtrar notificaciones futuras
      const futureNotifications = mockNotifications.filter(
        notif => notif.time > now
      );

      setNotifications(futureNotifications.slice(0, 3)); // Máximo 3 notificaciones
    }, 60000); // Cada minuto

    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = date - now;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `En ${days} día(s)`;
    if (hours > 0) return `En ${hours} hora(s)`;
    if (minutes > 0) return `En ${minutes} minuto(s)`;
    return 'Ahora';
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder': return '⏰';
      case 'appointment': return '📅';
      case 'confirmation': return '✅';
      default: return '🔔';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header con branding del negocio */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        padding: '24px 20px',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🏢
            </div>
            <div>
              <h1 style={{ 
                margin: '0', 
                fontSize: '20px', 
                fontWeight: '700' 
              }}>
                LATOTTY
              </h1>
              <p style={{ 
                margin: '4px 0 0 0', 
                fontSize: '14px',
                opacity: 0.9 
              }}>
                Sistema de Gestión de Citas
              </p>
            </div>
          </div>
          
          {/* Botón de login para admin/empleados */}
          {!user && (
            <button
              onClick={handleLogin}
              style={{
                padding: '10px 16px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
                🔑 Admin/Empleado
            </button>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: user ? '2fr 1fr' : '1fr',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          
          {/* Panel izquierdo - Información del negocio */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              color: '#1f2937', 
              fontSize: '18px',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              📍 Información del Negocio
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: '24px',
                  minWidth: '40px',
                  textAlign: 'center'
                }}>
                  🏢
                </span>
                <div>
                  <h3 style={{ 
                    margin: '0', 
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1f2937'
                  }}>
                    LATOTTY
                  </h3>
                  <p style={{ 
                    margin: '4px 0', 
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    Peluquería y Barbería Profesional
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>📍</span>
                  <span style={{ color: '#374151' }}>Cra 45 #123-456</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>📞</span>
                  <span style={{ color: '#374151' }}>+57 300 123 4567</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🕐</span>
                  <span style={{ color: '#374151' }}>Lun a Sáb: 9:00 AM - 7:00 PM</span>
                </div>
              </div>
            </div>

            {/* Botones de acción rápida */}
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ 
                color: '#1f2937', 
                fontSize: '16px',
                marginBottom: '12px',
                fontWeight: '600'
              }}>
                🚀 Acciones Rápidas
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => alert('Función de reserva próximamente')}
                  style={{
                    padding: '16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  📅 Reservar Cita
                </button>
                <button
                  onClick={() => alert('Ver mis citas próximamente')}
                  style={{
                    padding: '16px',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  📋 Mis Citas
                </button>
              </div>
            </div>
          </div>

          {/* Panel derecho - Notificaciones */}
          {user && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ 
                color: '#1f2937', 
                fontSize: '18px',
                marginBottom: '16px',
                fontWeight: '600'
              }}>
                🔔 Notificaciones
              </h2>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Hora actual</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {currentTime.toLocaleTimeString('es-CO', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div key={notif.id} style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <span style={{ fontSize: '16px' }}>
                        {getNotificationIcon(notif.type)}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>
                          {notif.title}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#64748b',
                          marginBottom: '4px'
                        }}>
                          {notif.message}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#8b5cf6',
                          fontWeight: '500'
                        }}>
                          {formatTime(notif.time)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#9ca3af',
                    fontSize: '14px'
                  }}>
                    📭 No tienes notificaciones nuevas
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '16px 20px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '14px'
      }}>
        <p>© 2024 LATOTTY - Powered by KDice POS</p>
        <p style={{ fontSize: '12px', marginTop: '4px' }}>
          🎲 Sistema de Gestión de Citas v1.0
        </p>
      </div>
    </div>
  );
}
