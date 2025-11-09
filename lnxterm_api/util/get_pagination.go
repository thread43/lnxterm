package util

func GetPagination(page int, size int, total int) map[string]interface{} {
	var first int
	var prev int
	var next int
	var last int

	first = 1
	prev = page - 1
	next = page + 1
	last = ((total - 1) / size) + 1

	var is_first bool
	var has_prev bool
	var has_next bool
	var is_last bool

	if page == first {
		is_first = true
	}
	if prev >= first && prev <= last {
		has_prev = true
	}
	if next >= first && next <= last {
		has_next = true
	}
	if page == last {
		is_last = true
	}

	var pages []int
	pages = make([]int, 0)

	var i int
	for i = 1; i <= last; i++ {
		if i >= (page-10) && i <= (page+10) {
			pages = append(pages, i)
		}
	}

	var pagination map[string]interface{}
	pagination = map[string]interface{}{
		"page":  page,
		"size":  size,
		"total": total,

		"first": first,
		"prev":  prev,
		"next":  next,
		"last":  last,

		"is_first": is_first,
		"has_prev": has_prev,
		"has_next": has_next,
		"is_last":  is_last,

		"pages": pages,
	}

	return pagination
}
