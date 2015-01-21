$(document).ready(function () {
    function Carousel () {
        return this.construct.apply(this, arguments);
    };
    Carousel.prototype = (function () {
        var construct, transform, getNext, getPrevious, getFace, // public methods
            defaults, transformProp, // private vars
            detectMarkup, setupFaces, setupFullscreen;// private methods

        // Vars
        defaults = {
            horizontal: true,
            fullscreen: true,
            fullscreenPercentage: 1
        };
        transformProp = Modernizr.prefixed('transform');

        // Methods
        construct = function ($container, settings) {
            var scope = this;

            scope.settings = $.extend({}, defaults, settings);

            detectMarkup.apply(scope, [$container]);

            setupFaces.apply(scope);

            setTimeout(function () {
                scope.markup.container.addClass('is-enhanced');
            }, 10);

            if (scope.settings.fullscreen) {
                setupFullscreen.apply(scope);
            }

            return scope;
        };
        detectMarkup = function ($container) {
            var scope = this;

            this.markup = {
                container: $container,
                carousel: $container.find('.carousel'),
                faces: $container.find('.face')
            };

            return scope;
        };
        setupFaces = function () {
            var scope = this;

            scope.rotation = 0;
            scope.faceCount = scope.markup.faces.length;
            scope.theta = 360 / scope.faceCount;
            scope.faceSize = scope.settings.horizontal ? scope.markup.container.width() :  scope.markup.container.height() ;
            scope.rotateFn = scope.settings.horizontal ? 'rotateY' : 'rotateX';
            scope.radius = Math.round( ( scope.faceSize / 2) / Math.tan( Math.PI / this.faceCount ) );
            scope.rotation = Math.round( scope.rotation / scope.theta ) * scope.theta;

            scope.markup.faces.each(function (index, face) {
                var angle, style;

                angle = scope.theta * index;
                style = {
                    'opacity': 1,
                    'background-color': 'hsla(' + angle + ', 100%, 50%, 1)'
                };
                style[ transformProp ] = scope.rotateFn + '(' + angle + 'deg) translateZ(' + scope.radius + 'px)';
                $(face).css(style);
            });

            transform.apply(scope);

            return scope;
        };
        transform = function () {
            var scope = this, style;

            style = {};
            style[ transformProp  ] = 'translateZ(-' + scope.radius + 'px) ' + scope.rotateFn + '(' + scope.rotation + 'deg)'
            scope.markup.carousel.css(style);

            return scope;
        };
        getFace = function (index) {
            var scope = this;

            scope.rotation = scope.theta * - index;
            transform.apply(scope);

            return scope;
        };
        getNext = function () {
            var scope = this;

            scope.rotation += scope.theta * -1;
            transform.apply(scope);

            return scope;
        };
        getPrevious = function () {
            var scope = this;

            scope.rotation += scope.theta * 1;
            transform.apply(scope);

            return scope;
        };
        setupFullscreen = function () {
            var scope = this, resize, $window, lastSeenWidth, lastSeenHeight;

            scope.markup.container.addClass('is-fullscreen');

            $window = $(window);

            resize = function () {
                var items, width, height;

                items = scope.markup.container.add(scope.markup.faces);
                width = $window.width();
                height = $window.height();

                if (lastSeenWidth === width && lastSeenHeight === height) {
                    return;
                }
                lastSeenWidth = width;
                lastSeenHeight = height;

                items.css({
                    'width': width * scope.settings.fullscreenPercentage,
                    'height': height * scope.settings.fullscreenPercentage
                });
                scope.markup.container.css({
                    'margin-top': height * ( 1 - scope.settings.fullscreenPercentage ) / 2
                });

                setupFaces.apply(scope);
            };
            $window.resize(resize);
            resize();

            return scope;
        };

        return {
            construct: construct,
            transform: transform,
            getNext: getNext,
            getPrevious: getPrevious,
            getFace: getFace
        };
    }());

    window.carousel = new Carousel($('.experiment'));
    $('a[href="#next"]').on('click', function (event) {
        event.preventDefault();

        carousel.getNext();
    });
    $('a[href="#prev"]').on('click', function (event) {
        event.preventDefault();

        carousel.getPrevious();
    });
});