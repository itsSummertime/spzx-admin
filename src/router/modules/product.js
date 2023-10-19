const Layout = () => import('@/layout/index.vue')
const category = () => import('@/views/product/category.vue') //分类管理页面
const brand = () => import('@/views/product/brand.vue') //品牌管理页面
const categoryBrand = () => import('@/views/product/categoryBrand.vue') //分类品牌页面
const productSpec = () => import('@/views/product/productSpec.vue') //商品规格页面
const productList = () => import('@/views/product/productList.vue') //商品列表页面

export default [
    {
        path: '/product',
        component: Layout,
        name: 'product',
        meta: {
            title: '商品管理',
        },
        icon: 'HelpFilled',
        children: [
            {
                path: 'category',
                name: 'category',
                component: category,
                meta: {
                    title: '分类管理',
                },
            },
            {
                path: 'brand',
                name: 'brand',
                component: brand,
                meta: {
                    title: '品牌管理',
                },
            },
            {
                path: 'categoryBrand',
                name: 'categoryBrand',
                component: categoryBrand,
                meta: {
                    title: '分类品牌',
                },
            },
            {
                path: 'productSpec',
                name: 'productSpec',
                component: productSpec,
                meta: {
                    title: '商品规格',
                },
            },
            {
                path: 'productList',
                name: 'productList',
                component: productList,
                meta: {
                    title: '商品列表',
                },
            },
        ],
    },
]