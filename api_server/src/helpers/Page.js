/*
2016-08-05 정현승

Usage 1.            --------- 현재 페이지 번호
                    -   -------- List의 총 갯수
                    -   -
var page = new Page(4, 582);


Usage 2. (optional)         ------- 한 페이지에 보여질 Row의 갯수 (Defalut 10)
                            -   ------ 한 페이지 그룹에 보여질 페이지의 갯수 (Default 5)
                            -   -
var page = new Page(4, 582, 30, 10);

*/

module.exports = function (_currentPage, _totalListSize, _pageSize, _pageGroupSize) {

    let totalListSize = _totalListSize,
        pageSize = _pageSize || 10,
        pageGroupSize = _pageGroupSize || 5,
        currentPage = _currentPage,
        pageCount, pageGroupCount, currentPageGroup, beginRow, endRow, beginPage, endPage,
        limit, isFirstPage, isLastPage, isFirstPageGroup, isLastPageGroup,
        isEmpty = false;

    if (totalListSize === 0) {
        isEmpty = true;
    }
    pageCount = Math.floor(totalListSize / pageSize) + (totalListSize % pageSize === 0 ? 0 : 1);

    if (currentPage <= 0) {
        currentPage = 1;
    }

    if (currentPage > pageCount) {
        currentPage = pageCount;
    }

    pageGroupCount = Math.floor(pageCount / pageGroupSize) + (pageCount % pageGroupSize === 0 ? 0 : 1);

    currentPageGroup = Math.floor(currentPage / pageGroupSize) + (currentPage % pageGroupSize === 0 ? 0 : 1);

    beginRow = !isEmpty ? pageSize * (currentPage - 1) + 1 : 0;

    endRow = (currentPage === pageCount) ? totalListSize : (pageSize * currentPage);

    beginPage = !isEmpty ? (pageGroupSize * currentPageGroup) - (pageGroupSize - 1) : 0;

    endPage = (beginPage + (pageGroupSize - 1)) < pageCount ? (beginPage + (pageGroupSize - 1)) : pageCount;

    isFirstPage = currentPage === 1;

    isLastPage = currentPage === pageCount;

    isFirstPageGroup = currentPageGroup === 1;

    isLastPageGroup = currentPageGroup === pageGroupCount;

    limit = beginRow - 1;

    if (limit < 0) {
        limit = 0;
    }

    return {
        totalListSize: totalListSize,
        pageSize: pageSize,
        pageGroupSize: pageGroupSize,
        pageCount: pageCount,
        pageGroupCount: pageGroupCount,
        currentPage: currentPage,
        currentPageGroup: currentPageGroup,
        beginRow: beginRow,
        endRow: endRow,
        beginPage: beginPage,
        endPage: endPage,
        limit: limit,
        isFirstPage: isFirstPage,
        isLastPage: isLastPage,
        isFirstPageGroup: isFirstPageGroup,
        isLastPageGroup: isLastPageGroup,
        isEmpty: isEmpty
    };
};