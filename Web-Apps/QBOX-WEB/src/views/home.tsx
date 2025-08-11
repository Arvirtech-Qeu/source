import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ChevronRight, ArrowRight, Star, Clock, MapPin, Phone, Mail, Users, ShoppingBag, Award } from 'lucide-react';
import logo from '@assets/images/q-logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { getDashboardStockSummary } from "@state/loaderDashboardSlice"


const QeuBoxHomeScreen = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [animatedStats, setAnimatedStats] = useState({
        // customers: 0,
        restaurants: 0,
        orders: 0,
        cities: 0,
        areas: 0,
    });

    const dashboardData = useSelector(((state: RootState) => state.loaderDashboard));
    const loading = useSelector(((state: RootState) => state.loaderDashboard.loading));

    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    useEffect(() => {
        // Fetch dashboard data when component mounts
        dispatch(getDashboardStockSummary({})); // pass any required params
    }, [dispatch]);

    useEffect(() => {
        // Only animate when we have the data and it's not loading
        console.log("dashboardData", dashboardData);
        if (!loading && dashboardData) {
            const animateStats = () => {

                const targets = {
                    restaurants: dashboardData.getDashboardStockList['restaurantCount'] || 0,
                    orders: dashboardData.getDashboardStockList['deliveryCount'] || 0,
                    cities: dashboardData.getDashboardStockList['cityCount'] || 0,
                    areas: dashboardData.getDashboardStockList['areaCount'] || 0

                };
                setAnimatedStats({
                    // customers: Math.floor((targets.customers * step) / steps),
                    restaurants: targets.restaurants,
                    orders: targets.orders,
                    cities: targets.cities,
                    areas: targets.areas,
                });
            };

            // Trigger animation after component mounts
            const timeout = setTimeout(animateStats, 500);
            return () => clearTimeout(timeout);
        }
    }, [loading, dashboardData]);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        // <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="min-h-screen low-bg-color">
            {/* Hero Section */}
            <section id="home" className="relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center py-20">
                        {/* Left Side - Content */}
                        <div className="lg:w-1/2 lg:mb-0">
                            <div className="">
                                <h2 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
                                    Delicious food, <br />
                                    delivered with <span className="text-transparent bg-clip-text text-color">speed</span>
                                </h2>
                                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                    Join thousands of food lovers who trust QeuBox for the best food delivery experience. Fast, reliable, and delicious - right to your doorstep.
                                </p>

                                {/* Feature Points */}
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center space-x-3">
                                        <div className="low-bg-color p-2 rounded-lg">
                                            <Clock className="text-orange-500" size={20} />
                                        </div>
                                        <p className="text-gray-700 font-medium">Lightning-fast delivery</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="low-bg-color p-2 rounded-lg">
                                            <div className="text-red-500 text-xl">🍔</div>
                                        </div>
                                        <p className="text-gray-700 font-medium">Wide restaurant selection</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="low-bg-color p-2 rounded-lg">
                                            <Award className="text-yellow-500" size={20} />
                                        </div>
                                        <p className="text-gray-700 font-medium">Exclusive offers and discounts</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Hero Image/Illustration */}
                        <div className="lg:w-1/2 relative">
                            <div className="relative">
                                {/* Background Decorative Elements */}
                                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-r from-orange-200 to-red-200 opacity-50"></div>
                                <div className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-gradient-to-r from-red-200 to-yellow-200 opacity-50"></div>
                                <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-orange-200 to-yellow-200 opacity-50"></div>

                                {/* Main Hero Content */}
                                <div className="relative bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-8xl mb-4">🍔</div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Fresh & Delicious</h3>
                                        <p className="text-gray-600 mb-6">Over 500+ restaurants at your fingertips</p>

                                        {/* Mini Stats */}
                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            <div className="low-bg-color p-3 rounded-lg">
                                                <div className="text-2xl font-bold text-color">10min</div>
                                                <div className="text-sm text-gray-600">Avg Delivery</div>
                                            </div>
                                            <div className="low-bg-color p-3 rounded-lg">
                                                <div className="text-2xl font-bold text-red-600">4.8★</div>
                                                <div className="text-sm text-gray-600">Customer Rating</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose QeuBox?</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Experience the future of food delivery with our innovative features designed to make your life easier.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group p-6 low-bg-color rounded-2xl hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Clock className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Lightning-Fast Delivery</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Get your favorite meals delivered in 10 minutes or less with our optimized delivery network and real-time tracking.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-6 low-bg-color rounded-2xl hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-red-500 to-yellow-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <div className="text-white text-2xl">🍔</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Wide Restaurant Selection</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Choose from hundreds of restaurants and cuisines. From local favorites to popular chains, we've got something for everyone.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-6 low-bg-color rounded-2xl hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ShoppingBag className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Easy Mobile Ordering</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Order with just a few taps on our intuitive mobile app. Save your favorites, track orders, and reorder with ease.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group p-6 low-bg-color rounded-2xl hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Award className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Exclusive Offers</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Enjoy special discounts, loyalty rewards, and exclusive deals available only to QeuBox customers.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="group p-6 low-bg-color rounded-2xl hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-red-500 to-yellow-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Users className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Quality Guaranteed</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We ensure food quality and freshness with our partner restaurants. Not satisfied? We'll make it right.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="group p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Star className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Premium Experience</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Enjoy a premium food delivery experience with our carefully curated restaurant partners and exceptional service.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 low-bg-color">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Getting your favorite food delivered is easier than ever. Just follow these simple steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Step 1 */}
                        <div className="text-center group">
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-white font-bold text-2xl">1</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Choose Restaurant</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Browse through our extensive list of partner restaurants and select your favorite cuisine.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center group">
                            <div className="bg-gradient-to-r from-red-500 to-yellow-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-white font-bold text-2xl">2</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Place Order</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Add items to your cart, customize your order, and choose your preferred payment method.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center group">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-white font-bold text-2xl">3</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Track Delivery</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Monitor your order in real-time from preparation to delivery with our live tracking feature.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="text-center group">
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-white font-bold text-2xl">4</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Enjoy Meal</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Receive your fresh, hot meal at your doorstep and enjoy the convenience of QeuBox.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-color">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Our Growing Community</h2>
                        <p className="text-white/90 text-lg max-w-2xl mx-auto">
                            Join thousands of satisfied customers who trust QeuBox for their food delivery needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-white mb-2">  {animatedStats.restaurants.toLocaleString()}+</div>
                            <div className="text-white/90 text-lg">Partner Restaurants</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-white mb-2">{animatedStats.orders.toLocaleString()}+</div>
                            <div className="text-white/90 text-lg">Orders Delivered</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-white mb-2">{animatedStats.cities.toLocaleString()}+</div>
                            <div className="text-white/90 text-lg">Cities Served</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-white mb-2">{animatedStats.areas.toLocaleString()}+</div>
                            <div className="text-white/90 text-lg">Areas Served</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="low-bg-color p-8 rounded-2xl shadow-xl">
                            <div className="flex items-center justify-center mb-6">
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="text-yellow-400 fill-current" size={24} />
                                    ))}
                                </div>
                            </div>
                            <blockquote className="text-center text-xl text-gray-700 italic mb-6 leading-relaxed">
                                "QeuBox has transformed my dining experience. The variety of restaurants and quick delivery times are unmatched!
                                I can always count on them for delicious food, and their customer service is exceptional."
                            </blockquote>
                            <div className="text-center">
                                <div className="font-bold text-gray-800 text-lg">Sarah Johnson</div>
                                <div className="text-gray-600">Loyal Customer since 2023</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div>
                            <div className="flex items-center space-x-3 mb-6">
                                {/* <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl">
                                    <div className="text-2xl">🚀</div>
                                </div> */}
                                <div className="w-16 h-16">
                                    <img
                                        src={logo}
                                        alt="User Avatar"
                                        className="w-full h-full"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold">QeuBox</h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                QeuBox is your trusted food delivery partner, connecting you with the best restaurants in your area.
                                We're committed to delivering delicious food with speed and reliability.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Download App</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partner With Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Mail className="text-orange-500" size={18} />
                                    <span className="text-gray-400">support@qeubox.com</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="text-orange-500" size={18} />
                                    <span className="text-gray-400">+1 (555) 123-FOOD</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MapPin className="text-orange-500" size={18} />
                                    <span className="text-gray-400">Available 24/7</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                        <p className="text-gray-400">
                            © 2025 QeuBox. All rights reserved. | Privacy Policy | Terms of Service
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default QeuBoxHomeScreen;