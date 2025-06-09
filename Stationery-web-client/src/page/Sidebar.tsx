import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  Package,
  Trophy,
  Network,
  Search,
  ChevronDown,
  ChevronRight,
  Settings,
  User,
  Menu,
  X,
  Factory,
  Users,
  Flag,
  GitMerge,
  UserCheck,
  FileText,
  DollarSign,
  UserPlus
} from 'lucide-react'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    machineA: true,
    machineB: true,
    machineC: true
  })

  const menuItems = [
    // Tổng quan
    {
      id: 'dashboard',
      title: 'Trang Tổng Quan',
      icon: Home,
      path: '/',
      section: 'overview',
      description: 'Thông tin tổng hợp từ máy A & B'
    },
    // Máy A - Shoes
    {
      id: 'shoes',
      title: 'Danh Sách Giày',
      icon: Package,
      path: '/shoes',
      section: 'machineA',
      description: 'Xem giày, hãng sản xuất, phân phối',
      badge: 'A'
    },
    {
      id: 'manufacturers',
      title: 'Nhà Sản Xuất',
      icon: Factory,
      path: '/manufacturers',
      section: 'machineA',
      description: 'Quản lý nhà sản xuất',
      badge: 'A'
    },
    // Máy B - Racing
    {
      id: 'races',
      title: 'Danh Sách Giải Đua',
      icon: Trophy,
      path: '/races',
      section: 'machineB',
      description: 'Quản lý các giải đua',
      badge: 'B'
    },
    {
      id: 'racers',
      title: 'Vận Động Viên',
      icon: Users,
      path: '/racers',
      section: 'machineB',
      description: 'Quản lý thông tin vận động viên',
      badge: 'B'
    },
    {
      id: 'directors',
      title: 'Giám Đốc Cuộc Thi',
      icon: UserCheck,
      path: '/directors',
      section: 'machineB',
      description: 'Quản lý giám đốc tổ chức',
      badge: 'B'
    },
    {
      id: 'licenses',
      title: 'Giấy Phép',
      icon: FileText,
      path: '/licenses',
      section: 'machineB',
      description: 'Quản lý giấy phép cuộc thi',
      badge: 'B'
    },
    {
      id: 'sponsors',
      title: 'Nhà Tài Trợ',
      icon: DollarSign,
      path: '/sponsors',
      section: 'machineB',
      description: 'Quản lý nhà tài trợ',
      badge: 'B'
    },
    {
      id: 'participates',
      title: 'Sự Tham Gia',
      icon: UserPlus,
      path: '/participates',
      section: 'machineB',
      description: 'Quản lý vận động viên tham gia',
      badge: 'B'
    },
    // Máy C - Integration
    {
      id: 'integration',
      title: 'Kết Hợp Dữ Liệu',
      icon: GitMerge,
      path: '/integration',
      section: 'machineC',
      description: 'Tích hợp dữ liệu từ A & B',
      badge: 'C'
    },
    {
      id: 'search',
      title: 'Tìm Kiếm Phân Tán',
      icon: Search,
      path: '/search',
      section: 'machineC',
      description: 'Tìm kiếm đa nguồn',
      badge: 'C'
    }
  ]

  const sections = [
    {
      id: 'overview',
      title: 'Tổng Quan',
      items: menuItems.filter((item) => item.section === 'overview')
    },
    {
      id: 'machineA',
      title: 'Máy A - Giày',
      items: menuItems.filter((item) => item.section === 'machineA')
    },
    {
      id: 'machineB',
      title: 'Máy B - Giải Đua',
      items: menuItems.filter((item) => item.section === 'machineB')
    },
    {
      id: 'machineC',
      title: 'Máy C - Tích Hợp',
      items: menuItems.filter((item) => item.section === 'machineC')
    }
  ]

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <div
        className={`${isCollapsed ? 'w-16' : 'w-80'} bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Header */}
        <div className='p-6 border-b border-gray-100'>
          <div className='flex items-center justify-between'>
            {!isCollapsed && (
              <div>
                <h1 className='text-xl font-bold text-gray-900'>Racing System</h1>
                <p className='text-sm text-gray-500 mt-1'>Hệ thống phân tán A/B/C</p>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
            >
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4 overflow-y-auto'>
          <div className='space-y-6'>
            {sections.map((section) => (
              <div key={section.id}>
                {!isCollapsed && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className='flex items-center justify-between w-full text-left mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors'
                  >
                    <span>{section.title}</span>
                    {expandedSections[section.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}

                {(expandedSections[section.id] || isCollapsed) && (
                  <div className='space-y-1'>
                    {section.items.map((item) => {
                      const Icon = item.icon

                      return (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          className={({ isActive }) =>
                            `w-full flex items-center px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div
                                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                                  isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'
                                }`}
                              >
                                <Icon
                                  size={20}
                                  className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}
                                />
                              </div>

                              {!isCollapsed && (
                                <div className='ml-3 flex-1 min-w-0'>
                                  <div className='flex items-center justify-between'>
                                    <p
                                      className={`text-sm font-medium truncate ${
                                        isActive ? 'text-white' : 'text-gray-900'
                                      }`}
                                    >
                                      {item.title}
                                    </p>
                                    {item.badge && (
                                      <span
                                        className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                                          isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                                        }`}
                                      >
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p
                                    className={`text-xs mt-1 truncate ${isActive ? 'text-white/80' : 'text-gray-500'}`}
                                  >
                                    {item.description}
                                  </p>
                                </div>
                              )}
                            </>
                          )}
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom section */}
        <div className='p-4 border-t border-gray-100'>
          {!isCollapsed ? (
            <div className='space-y-2'>
              <div className='mt-4 p-3 bg-gray-50 rounded-xl'>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                    <User size={20} className='text-white' />
                  </div>
                  <div className='ml-3 flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 truncate'>Admin</p>
                    <p className='text-xs text-gray-500 truncate'>System Manager</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='space-y-2'>
              <button className='w-full p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex justify-center'>
                <Settings size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
