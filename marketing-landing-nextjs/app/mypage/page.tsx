'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useAuth } from '@/lib/auth-context';
import { doc, updateDoc, serverTimestamp, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Order {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  amount: number;
  status: string;
  createdAt: Date;
}

export default function MyPage() {
  const router = useRouter();
  const { user, userProfile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // 로그인 체크
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/mypage');
    }
  }, [user, loading, router]);

  // 프로필 데이터 로드
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        company: userProfile.company || '',
        phone: userProfile.phone || '',
      });
    }
  }, [userProfile]);

  // 주문 내역 로드
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const ordersRef = collection(db, 'orders');

        // userId 또는 userEmail로 조회 (인덱스 없이 단순 쿼리)
        // 먼저 userId로 조회
        const q1 = query(ordersRef, where('userId', '==', user.uid));
        const snapshot1 = await getDocs(q1);

        // userEmail로도 조회 (게스트로 결제했다가 나중에 로그인한 경우)
        const q2 = query(ordersRef, where('userEmail', '==', user.email));
        const snapshot2 = await getDocs(q2);

        // 중복 제거를 위한 Map 사용
        const orderMap = new Map<string, Order>();

        const processDoc = (doc: import('firebase/firestore').QueryDocumentSnapshot) => {
          const data = doc.data();
          if (!orderMap.has(doc.id)) {
            orderMap.set(doc.id, {
              id: doc.id,
              orderId: data.orderId,
              productId: data.productId,
              productName: data.productName,
              amount: data.amount,
              status: data.status,
              createdAt: data.createdAt?.toDate() || new Date(),
            });
          }
        };

        snapshot1.forEach(processDoc);
        snapshot2.forEach(processDoc);

        // 날짜순 정렬 (최신순)
        const orderList = Array.from(orderMap.values()).sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        console.log('조회된 주문 수:', orderList.length);
        setOrders(orderList);
      } catch (error) {
        console.error('주문 내역 로드 오류:', error);
      }
    };

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, activeTab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        updatedAt: serverTimestamp(),
      });

      setIsEditing(false);
      alert('프로필이 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      alert('프로필 업데이트에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">마이페이지</h1>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* 사이드바 */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6">
                {/* 프로필 요약 */}
                <div className="text-center mb-6 pb-6 border-b border-border">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">
                      {userProfile?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg">{userProfile?.name || '사용자'}</h2>
                  <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                  {userProfile?.company && (
                    <p className="text-sm text-muted-foreground mt-1">{userProfile.company}</p>
                  )}
                </div>

                {/* 메뉴 */}
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    프로필 관리
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    결제 내역
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeTab === 'settings'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    설정
                  </button>
                </nav>

                {/* 로그아웃 */}
                <button
                  onClick={handleLogout}
                  className="w-full mt-6 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  로그아웃
                </button>
              </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-3">
              {/* 프로필 관리 */}
              {activeTab === 'profile' && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">프로필 관리</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg text-sm font-medium transition-all"
                      >
                        수정
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-border hover:bg-secondary rounded-lg text-sm font-medium transition-all"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground rounded-lg text-sm font-medium transition-all"
                        >
                          {isSaving ? '저장 중...' : '저장'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">이메일</label>
                      <input
                        type="email"
                        value={userProfile?.email || ''}
                        disabled
                        className="w-full px-4 py-3 bg-secondary border border-input rounded-lg text-foreground opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">이름</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-secondary border border-input rounded-lg text-foreground disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">회사명</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-secondary border border-input rounded-lg text-foreground disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">연락처</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-secondary border border-input rounded-lg text-foreground disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">가입일</label>
                      <input
                        type="text"
                        value={userProfile?.createdAt?.toLocaleDateString('ko-KR') || ''}
                        disabled
                        className="w-full px-4 py-3 bg-secondary border border-input rounded-lg text-foreground opacity-60"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 결제 내역 */}
              {activeTab === 'orders' && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6">결제 내역</h2>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-muted-foreground mb-4">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                      <p className="text-muted-foreground mb-4">결제 내역이 없습니다.</p>
                      <Link
                        href="/products"
                        className="inline-block px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-medium transition-all"
                      >
                        상품 둘러보기
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold">{order.productName}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              order.status === 'completed'
                                ? 'bg-green-500/10 text-green-500'
                                : order.status === 'pending'
                                ? 'bg-yellow-500/10 text-yellow-500'
                                : 'bg-red-500/10 text-red-500'
                            }`}>
                              {order.status === 'completed' ? '결제완료' : order.status === 'pending' ? '대기중' : '취소됨'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{order.createdAt.toLocaleDateString('ko-KR')}</span>
                            <span className="font-bold text-foreground">{order.amount.toLocaleString()}원</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 설정 */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-6">알림 설정</h2>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="font-medium">이메일 알림</p>
                          <p className="text-sm text-muted-foreground">새로운 소식과 프로모션 정보를 받습니다.</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="font-medium">마케팅 수신 동의</p>
                          <p className="text-sm text-muted-foreground">마케팅 관련 정보를 받습니다.</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 rounded" />
                      </label>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-6">계정 관리</h2>
                    <div className="space-y-4">
                      <button className="w-full text-left px-4 py-3 border border-border hover:border-primary rounded-lg transition-colors">
                        비밀번호 변경
                      </button>
                      <button className="w-full text-left px-4 py-3 border border-red-500/30 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                        계정 삭제
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
