from django.urls import path
from . import views

urlpatterns = [
    # Product endpoints
    path('products/', views.product_list, name='product-list'),
    path('products/<int:pk>/', views.product_detail, name='product-detail'),
    path('categories/', views.product_categories, name='product-categories'),
    path('products/category/<str:category>/', views.products_by_category, name='products-by-category'),
    
    # Order endpoints
    path('orders/', views.order_list, name='order-list'),
    path('orders/<str:pk>/', views.order_detail, name='order-detail'),
    path('orders/<str:pk>/cancel/', views.cancel_order, name='cancel-order'),
    
    # Payment endpoints
    path('payment/', views.process_payment, name='process-payment'),
    path('transactions/', views.transaction_list, name='transaction-list'),
    
    # Authentication endpoints
    path('auth/signup/', views.user_signup, name='user-signup'),
    path('auth/login/', views.user_login, name='user-login'),
    path('auth/profile/', views.user_profile, name='user-profile'),
    
    # Wishlist endpoints
    path('wishlist/', views.wishlist, name='wishlist'),
    path('wishlist/<int:pk>/', views.wishlist_item, name='wishlist-item'),
]
