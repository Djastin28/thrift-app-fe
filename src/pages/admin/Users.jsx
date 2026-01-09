import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Alert } from '../../components/ui/Alert';
import { DataTable } from '../../components/ui/DataTable';
import { adminApi } from '../../api/admin';
import { 
  UserCheck,
  UserX,
  Shield,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        limit: 100, // Get more users for client-side pagination
        ...(roleFilter !== 'all' && { role: roleFilter }),
      };
      const { data } = await adminApi.getUsers(params);
      setUsers(data.data || data.users || []);
    } catch (err) {
      setError('Gagal memuat data pengguna');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = useCallback(async (userId, newRole) => {
    setUpdating(userId);
    try {
      await adminApi.updateUser(userId, { role: newRole });
      await fetchUsers();
    } catch (err) {
      setError('Gagal mengubah role pengguna');
      console.error(err);
    } finally {
      setUpdating(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleActive = useCallback(async (userId, currentStatus) => {
    setUpdating(userId);
    try {
      await adminApi.updateUser(userId, { is_active: !currentStatus });
      await fetchUsers();
    } catch (err) {
      setError('Gagal mengubah status pengguna');
      console.error(err);
    } finally {
      setUpdating(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'bg-purple-100 text-purple-700 border-purple-200',
      customer: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return variants[role] || variants.customer;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Define columns for TanStack Table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Pengguna',
        cell: ({ row }) => {
          const initials = row.original.name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
          
          const colors = [
            'from-indigo-500 to-purple-600',
            'from-blue-500 to-cyan-600',
            'from-emerald-500 to-teal-600',
            'from-orange-500 to-red-600',
            'from-pink-500 to-rose-600',
          ];
          const colorIndex = row.original.id % colors.length;
          
          return (
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colors[colorIndex]} text-white flex-shrink-0 shadow-sm`}>
                <span className="text-sm font-bold">
                  {initials}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {row.original.name}
                </p>
                <div className="flex items-center gap-1 text-xs text-slate-500 truncate mt-0.5">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{row.original.email}</span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <Badge className={getRoleBadge(row.original.role)}>
            {row.original.role === 'admin' ? (
              <Shield className="h-3 w-3 mr-1.5" />
            ) : (
              <User className="h-3 w-3 mr-1.5" />
            )}
            <span className="capitalize">{row.original.role}</span>
          </Badge>
        ),
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            className={
              row.original.is_active
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }
          >
            {row.original.is_active ? 'Aktif' : 'Nonaktif'}
          </Badge>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Bergabung',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(row.original.created_at)}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleUpdateRole(
                  row.original.id,
                  row.original.role === 'admin' ? 'customer' : 'admin'
                )
              }
              disabled={updating === row.original.id}
              className="text-xs whitespace-nowrap"
            >
              {updating === row.original.id ? (
                <LoadingSpinner className="h-3 w-3" />
              ) : (
                <>
                  <Shield className="h-3 w-3 mr-1" />
                  {row.original.role === 'admin' ? 'Customer' : 'Admin'}
                </>
              )}
            </Button>
            <Button
              variant={row.original.is_active ? 'outline' : 'default'}
              size="sm"
              onClick={() => handleToggleActive(row.original.id, row.original.is_active)}
              disabled={updating === row.original.id}
              className="text-xs whitespace-nowrap"
            >
              {updating === row.original.id ? (
                <LoadingSpinner className="h-3 w-3" />
              ) : row.original.is_active ? (
                <>
                  <UserX className="h-3 w-3 mr-1" />
                  Nonaktifkan
                </>
              ) : (
                <>
                  <UserCheck className="h-3 w-3 mr-1" />
                  Aktifkan
                </>
              )}
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [updating, handleUpdateRole, handleToggleActive]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pengguna</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola pengguna sistem</p>
        </div>

        {/* Role Filter */}
        <div className="flex gap-2">
          <Button
            variant={roleFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRoleFilter('all')}
          >
            Semua
          </Button>
          <Button
            variant={roleFilter === 'customer' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRoleFilter('customer')}
          >
            Customer
          </Button>
          <Button
            variant={roleFilter === 'admin' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRoleFilter('admin')}
          >
            Admin
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchUsers}>
              Coba Lagi
            </Button>
          </div>
        </Alert>
      )}

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                <User className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-base font-medium text-slate-900 mb-1">Tidak ada pengguna ditemukan</p>
              <p className="text-sm text-slate-500">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <div className="p-4">
              <DataTable
                columns={columns}
                data={users}
                searchKey="name"
                searchPlaceholder="Cari nama atau email..."
                pageSize={10}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
