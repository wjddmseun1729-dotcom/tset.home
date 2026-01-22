'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 타입 정의
interface UserData {
  uid: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  role: string;
  createdAt: Date;
}

interface OrderData {
  id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  productId: string;
  productName: string;
  amount: number;
  status: string;
  createdAt: Date;
}

interface LeadData {
  id: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
  budget: string;
  message: string;
  status: string;
  createdAt: Date;
}

interface NewsletterData {
  id: string;
  email: string;
  status: string;
  createdAt: Date;
}

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalLeads: number;
  totalSubscribers: number;
}

export default function AdminDashboardPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'leads' | 'newsletter'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalLeads: 0,
    totalSubscribers: 0,
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 인증 확인
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !isAdmin) {
      router.push('/mypage');
    }
  }, [user, loading, isAdmin, router]);

  // 데이터 로드
  useEffect(() => {
    if (user && isAdmin) {
      loadDashboardData();
    }
  }, [user, isAdmin]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 사용자 목록 가져오기
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const usersSnapshot = await getDocs(usersQuery);
      const usersData: UserData[] = usersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as UserData[];
      setUsers(usersData);

      // 주문 목록 가져오기 (인덱스 없이 전체 조회 후 정렬)
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      console.log('Orders 컬렉션 문서 수:', ordersSnapshot.size);
      const ordersData: OrderData[] = ordersSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('주문 데이터:', doc.id, data);
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }) as OrderData[];
      // 최신순 정렬
      ordersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setOrders(ordersData);

      // 상담 신청 목록 가져오기
      const leadsQuery = query(
        collection(db, 'leads'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
      const leadsSnapshot = await getDocs(leadsQuery);
      const leadsData: LeadData[] = leadsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as LeadData[];
      setLeads(leadsData);

      // 뉴스레터 구독자 목록 가져오기
      const newsletterQuery = query(
        collection(db, 'newsletter'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
      const newsletterSnapshot = await getDocs(newsletterQuery);
      const subscribersData: NewsletterData[] = newsletterSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as NewsletterData[];
      setSubscribers(subscribersData);

      // 통계 계산
      const totalRevenue = ordersData
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.amount, 0);

      setStats({
        totalUsers: usersData.length,
        totalOrders: ordersData.length,
        totalRevenue,
        totalLeads: leadsData.length,
        totalSubscribers: subscribersData.length,
      });
    } catch (error) {
      console.error('대시보드 데이터 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user || !isAdmin) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
            <p className="text-muted-foreground">
              서비스 현황을 한눈에 확인하세요
            </p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">회원</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">주문</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">매출</p>
                  <p className="text-xl font-bold">{(stats.totalRevenue / 10000).toFixed(0)}만</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">상담신청</p>
                  <p className="text-2xl font-bold">{stats.totalLeads}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">뉴스레터</p>
                  <p className="text-2xl font-bold">{stats.totalSubscribers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="border-b border-border mb-6 overflow-x-auto">
            <nav className="flex gap-6 min-w-max">
              {[
                { id: 'overview', label: '개요' },
                { id: 'leads', label: '상담신청' },
                { id: 'orders', label: '주문관리' },
                { id: 'users', label: '회원관리' },
                { id: 'newsletter', label: '뉴스레터' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`pb-4 font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* 탭 컨텐츠 */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {/* 개요 탭 */}
              {activeTab === 'overview' && (
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* 최근 상담신청 */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-bold mb-4">최근 상담 신청</h3>
                    <div className="space-y-4">
                      {leads.slice(0, 5).map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{lead.company}</p>
                            <p className="text-sm text-muted-foreground">{lead.name} · {lead.phone}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            lead.status === 'new' ? 'bg-blue-500/10 text-blue-500' :
                            lead.status === 'contacted' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-green-500/10 text-green-500'
                          }`}>
                            {lead.status === 'new' ? '신규' : lead.status === 'contacted' ? '연락완료' : '전환'}
                          </span>
                        </div>
                      ))}
                      {leads.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">아직 상담신청이 없습니다</p>
                      )}
                    </div>
                  </div>

                  {/* 최근 주문 */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-bold mb-4">최근 주문</h3>
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{order.productName || order.productId}</p>
                            <p className="text-sm text-muted-foreground">{order.userEmail}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{order.amount.toLocaleString()}원</p>
                            <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                              order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              {order.status === 'completed' ? '완료' : '대기'}
                            </span>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">아직 주문이 없습니다</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 상담신청 탭 */}
              {activeTab === 'leads' && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-secondary">
                          <th className="px-4 py-3 text-left text-sm font-medium">회사/담당자</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">연락처</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">업종</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">예산</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">상태</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">신청일</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => (
                          <tr key={lead.id} className="border-t border-border hover:bg-secondary/50">
                            <td className="px-4 py-3">
                              <p className="font-medium">{lead.company}</p>
                              <p className="text-sm text-muted-foreground">{lead.name}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm">{lead.email}</p>
                              <p className="text-sm text-muted-foreground">{lead.phone}</p>
                            </td>
                            <td className="px-4 py-3 text-sm">{lead.industry || '-'}</td>
                            <td className="px-4 py-3 text-sm">{lead.budget || '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                lead.status === 'new' ? 'bg-blue-500/10 text-blue-500' :
                                lead.status === 'contacted' ? 'bg-yellow-500/10 text-yellow-500' :
                                'bg-green-500/10 text-green-500'
                              }`}>
                                {lead.status === 'new' ? '신규' : lead.status === 'contacted' ? '연락완료' : '전환'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {lead.createdAt.toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {leads.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">아직 상담신청이 없습니다</div>
                    )}
                  </div>
                </div>
              )}

              {/* 주문 관리 탭 */}
              {activeTab === 'orders' && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-secondary">
                          <th className="px-4 py-3 text-left text-sm font-medium">주문번호</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">상품</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">주문자</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">금액</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">상태</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">주문일</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-t border-border hover:bg-secondary/50">
                            <td className="px-4 py-3">
                              <span className="font-mono text-sm">{(order.orderId || order.id).slice(0, 15)}...</span>
                            </td>
                            <td className="px-4 py-3 font-medium">{order.productName || order.productId}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{order.userEmail}</td>
                            <td className="px-4 py-3 font-bold">{order.amount.toLocaleString()}원</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                              }`}>
                                {order.status === 'completed' ? '결제완료' : '대기중'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {order.createdAt.toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {orders.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">아직 주문이 없습니다</div>
                    )}
                  </div>
                </div>
              )}

              {/* 회원 관리 탭 */}
              {activeTab === 'users' && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-secondary">
                          <th className="px-4 py-3 text-left text-sm font-medium">회원</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">회사</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">연락처</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">역할</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">가입일</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((userData) => (
                          <tr key={userData.uid} className="border-t border-border hover:bg-secondary/50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="font-bold text-primary text-sm">{userData.name?.charAt(0) || '?'}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{userData.name}</p>
                                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{userData.company || '-'}</td>
                            <td className="px-4 py-3 text-muted-foreground">{userData.phone || '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                userData.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-secondary text-foreground'
                              }`}>
                                {userData.role === 'admin' ? '관리자' : '일반'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {userData.createdAt.toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">아직 가입한 회원이 없습니다</div>
                    )}
                  </div>
                </div>
              )}

              {/* 뉴스레터 탭 */}
              {activeTab === 'newsletter' && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-secondary">
                          <th className="px-6 py-4 text-left text-sm font-medium">이메일</th>
                          <th className="px-6 py-4 text-left text-sm font-medium">상태</th>
                          <th className="px-6 py-4 text-left text-sm font-medium">구독일</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((sub) => (
                          <tr key={sub.id} className="border-t border-border hover:bg-secondary/50">
                            <td className="px-6 py-4">{sub.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                sub.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                              }`}>
                                {sub.status === 'active' ? '구독중' : '해지'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {sub.createdAt.toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {subscribers.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">아직 구독자가 없습니다</div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
