"use client"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, ShoppingCart, Menu, Heart, Bell, User, ChevronDown, BookOpen, GraduationCap } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { useHomeContext } from "@contexts/HomeContext"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"

function ModernNavbar({ setAuthType, onFocusNavigate }) {
  const [isCategories, setIsCategories] = useState(false)
  const { 
    setActive, 
    active, 
    userDetails, 
    logout, 
    search, 
    cart, 
    setSearch, 
    dropDown, 
    setDropDown, 
    searchResults, 
    setSearchResults, 
    setSearchData, 
    setOverviewCourse 
  } = useHomeContext()
  const [isTopics, setIsTopics] = useState(false)
  const [topics, setTopics] = useState([])
  const [clickedCategory, setClickedCategory] = useState('')
  const catref = useRef()
  const [categorieslist, setCategorieslist] = useState([])
  const searchDropRef = useRef(null)
  const [isProfile, setIsProfile] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const profileItems = [
    { tag: 'Dashboard', action: 'learning', icon: BookOpen },
    { tag: 'My cart', action: 'cart', icon: ShoppingCart },
    { tag: 'Wishlist', action: 'wishlist', icon: Heart },
    { tag: 'Log out', action: 'logout', icon: User }
  ]

  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (catref.current && !catref.current.contains(e.target)) {
        setIsCategories(false)
        setIsTopics(false)
        setClickedCategory('')
      }
    })
    getCategories()
  }, [])

  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (active !== 'teacher' && !pathname.split('/').includes('coursesDetails')) {
        if (searchDropRef && searchDropRef.current && !searchDropRef.current.contains(e.target) && e.target !== document.getElementById('searchForm') && !Array.from(document.getElementById('searchForm').children).includes(e.target)) {
          setDropDown(false)
        }
        else if ((e.target == document.getElementById('searchForm') || Array.from(document.getElementById('searchForm').children).includes(e.target))) {
          setDropDown(true)
        }
      }
    })
  }, [active])

  const getCategories = async () => {
    await axios.get(process.env.NEXT_PUBLIC_BASE_URL + '/categorieslist')
      .then(res => setCategorieslist(res.data))
  }

  const openTopics = (list) => {
    setIsTopics(true)
    setTopics(list)
  }

  useEffect(() => {
    const getSearchResults = async () => {
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/searchResults?search=${search}`)
        .then(res => { 
          setSearchResults(res.data)
          setSearchData({
            search: search,
            searchResults: res.data
          })
        })
    }
    getSearchResults()
  }, [search])

  useEffect(() => {
    if (searchResults.length > 0) {
      setDropDown(true)
    } else {
      setDropDown(false)
    }
  }, [searchResults])

  const submitHandler = (e) => {
    e.preventDefault()
    setSearchData({
      search: search,
      searchResults: searchResults
    })
  }

  const gotoCart = async () => {
    if (Object.keys(userDetails || {}).length === 0) {
      alert('Please login to access your cart.')
      router.push('/authentication/login')
    } else {
      try {
        const token = userDetails?.accessToken
        await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCart/${userDetails?.userDetails?._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            if (response.data.status == 'success') {
              router.push('/cart')
            }
          })
      } catch (error) {
        if (error.response?.status === 403) {
          alert('Session expired. Please login again to continue.')
          logout()
          router.push('/authentication/login')
        }
      }
    }
  }

  const profileItemHandler = (item) => {
    if (item.tag === 'Log out') {
      logout()
      router.push('/')
    } else {
      if (Object.keys(userDetails || {}).length === 0) {
        alert('Please login to access this section.')
        router.push('/authentication/login')
        return
      }
      router.push(`/${item.action}`)
    }
  }

  return (
    <nav className='w-full h-16 flex flex-row justify-between items-center relative lg:px-6 px-4 z-50 bg-white border-b border-gray-200 shadow-sm'>
      
      {/* Mobile Menu Button */}
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      {/* Logo */}
      <Link href={'/'} className="text-2xl font-bold text-primary flex items-center gap-2" onClick={() => setActive('home')}>
        <GraduationCap className="h-8 w-8" />
        <span className="hidden sm:block">SkillSphere</span>
      </Link>

      {/* Categories Dropdown */}
      <div ref={catref} className="font-medium hidden lg:block relative">
        <Button
          variant="ghost"
          onClick={() => { setIsCategories(!isCategories); setIsTopics(false); setClickedCategory('') }}
          className="flex items-center gap-1"
        >
          Categories
          <ChevronDown className="h-4 w-4" />
        </Button>
        
        {isCategories && (
          <Card className="absolute top-full left-0 mt-2 w-72 z-50">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                {categorieslist.map((course, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="justify-between h-auto p-2"
                    onClick={() => { openTopics(course.topics); setClickedCategory(course.category) }}
                  >
                    <span>{course.category}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${clickedCategory === course.category ? 'rotate-90' : ''}`} />
                  </Button>
                ))}
              </div>
              
              {isTopics && (
                <Card className="absolute top-0 left-full ml-2 w-60 z-50">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-sm text-muted-foreground mb-2">Popular Topics</span>
                      {topics.map((topic, topic_i) => (
                        <Link 
                          href={`/`} 
                          key={topic_i}
                          className="text-sm p-2 hover:bg-accent rounded-md transition-colors"
                        >
                          {topic}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Search Bar */}
      <form
        id="searchForm"
        className="w-full max-w-md hidden lg:flex relative"
        onSubmit={submitHandler}
      >
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              if (onFocusNavigate) {
                router.push('/search-results')
              }
            }}
            autoFocus={pathname.includes('search-results')}
            className="pl-10 pr-4"
          />
        </div>
      </form>

      {/* Navigation Items */}
      <div className="flex items-center gap-4">
        {/* Teacher Mode */}
        <Button
          variant="ghost"
          className="hidden lg:flex"
          onClick={() => {
            if (Object.keys(userDetails || {}).length === 0) {
              router.push('/authentication/login')
            } else {
              router.push('/teacher')
            }
          }}
        >
          Teach
        </Button>

        {/* My Learning */}
        <Button
          variant="ghost"
          onClick={() => {
            if (Object.keys(userDetails || {}).length === 0) {
              router.push('/authentication/login')
            } else {
              router.push('/learning')
            }
          }}
        >
          <BookOpen className="h-4 w-4 lg:mr-2" />
          <span className="hidden lg:block">Learn</span>
        </Button>

        {/* Wishlist */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (Object.keys(userDetails || {}).length === 0) {
              router.push('/authentication/login')
            } else {
              router.push('/wishlist')
            }
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Cart */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={gotoCart}
        >
          <ShoppingCart className="h-4 w-4" />
          {cart.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {cart.length}
            </Badge>
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>

        {/* User Profile / Auth */}
        {Object.keys(userDetails || {}).length === 0 ? (
          <div className="hidden lg:flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.push('/authentication/login')}
            >
              Login
            </Button>
            <Button 
              onClick={() => router.push('/authentication/register')}
            >
              Sign up
            </Button>
          </div>
        ) : (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsProfile(!isProfile)}
              className="relative"
            >
              <div className="flex font-semibold bg-primary rounded-full text-primary-foreground text-sm uppercase items-center justify-center h-8 w-8">
                <span>{userDetails?.userDetails?.username?.split(' ')[0]?.slice(0, 1)}</span>
                <span>{userDetails?.userDetails?.username?.split(' ')[1]?.slice(0, 1)}</span>
              </div>
            </Button>

            {isProfile && (
              <Card className="absolute top-full right-0 mt-2 w-64 z-50">
                <CardContent className="p-0">
                  <div className="flex gap-3 p-4 border-b">
                    <div className="flex font-semibold bg-primary rounded-full text-primary-foreground text-lg uppercase items-center justify-center h-10 w-10">
                      <span>{userDetails?.userDetails?.username?.split(' ')[0]?.slice(0, 1)}</span>
                      <span>{userDetails?.userDetails?.username?.split(' ')[1]?.slice(0, 1)}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{userDetails?.userDetails?.username}</p>
                      <p className="text-sm text-muted-foreground">{userDetails?.userDetails?.email}</p>
                    </div>
                  </div>
                  <div className="p-2">
                    {profileItems.map((item, i) => {
                      const IconComponent = item.icon
                      return (
                        <Button
                          key={i}
                          variant="ghost"
                          className="w-full justify-start gap-2 h-auto p-3"
                          onClick={() => profileItemHandler(item)}
                        >
                          <IconComponent className="h-4 w-4" />
                          {item.tag}
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default ModernNavbar